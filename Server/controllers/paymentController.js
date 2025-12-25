const crypto = require('crypto'); // Use native crypto
// const cryptoJS = require('crypto-js'); // Remove crypto-js dependency if not used elsewhere
const { v4: uuidv4 } = require('uuid');
const Payment = require('../models/payment.model');
const User = require('../models/user.model');
// const fetch = require('node-fetch'); // Ensure this is available or use native fetch in Node 18+ (but user is on Node 20, so native fetch might be there, but they installed node-fetch v2)
const fetch = require('node-fetch');

// initiateEsewaPayment function remains the same...
exports.initiateEsewaPayment = async (req, res) => {
  try {
    console.log("Initiating Payment...");
    const { plan, amount } = req.body;
    console.log("Request Body:", req.body);
    
    // Check user
    if (!req.user) {
      console.error("User not found in request. Auth middleware failure?");
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }
    const userId = req.user._id;

    if (!plan || !amount) {
      return res.status(400).json({ success: false, message: 'Plan and amount are required.' });
    }

    // Use UUID + Timestamp to guarantee uniqueness (prevents eSewa 409 Conflict)
    const transaction_uuid = `${uuidv4()}-${Date.now()}`;
    console.log("Generated UUID:", transaction_uuid);

    const newPayment = new Payment({ userId, plan, amount, transaction_uuid, status: 'pending' });
    await newPayment.save();
    console.log("Payment saved to DB");

    const secretKey = process.env.ESEWA_SECRET_KEY;
    const merchantCode = process.env.ESEWA_MERCHANT_CODE;

    console.log("DEBUG: ESEWA_MERCHANT_CODE:", merchantCode);
    console.log("DEBUG: ESEWA_SECRET_KEY:", secretKey ? "Loaded (Starts with " + secretKey.substring(0, 3) + ")" : "MISSING");
    
    if (!secretKey || !merchantCode) {
        throw new Error("Missing eSewa configuration (SECRET_KEY or MERCHANT_CODE) in Server environment.");
    }

    // eSewa v2 Signature: total_amount,transaction_uuid,product_code
    const message = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${merchantCode}`;
    console.log("Signing Message String:", message);
    
    // Native Crypto HMAC
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(message);
    const signature = hmac.digest('base64');
    
    console.log("Signature generated:", signature);

    // URL construction with fallbacks and protocol checks
    const apiBase = process.env.API_URL || 'http://localhost:5050/api';
    const frontendBase = process.env.BASE_URL || 'http://localhost:5173';

    // Helper to ensure URL starts with http:// or https://
    const ensureProtocol = (url) => url.startsWith('http') ? url : `http://${url}`;

    const successUrl = `${ensureProtocol(apiBase)}/payment/verify`;
    const failureUrl = `${ensureProtocol(frontendBase)}/payment/failure`;

    const esewaData = {
      amount: amount.toString(), // Check if eSewa needs strict formatting (e.g. 100 vs 100.00)
      failure_url: failureUrl,
      product_delivery_charge: "0",
      product_service_charge: "0",
      product_code: merchantCode,
      signature,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      success_url: successUrl,
      tax_amount: "0",
      total_amount: amount.toString(),
      transaction_uuid,
    };

    return res.status(200).json({ success: true, message: 'eSewa payment initiated', data: esewaData });
  } catch (error) {
    console.error("eSewa initiation error DETAILS:", error);
    return res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};


exports.verifyEsewaPayment = async (req, res) => {
    // Helper to ensure URL starts with http:// or https://
    const ensureProtocol = (url) => url.startsWith('http') ? url : `http://${url}`;
    
    // URL construction with fallbacks and protocol checks
    const frontendBase = process.env.BASE_URL || 'http://localhost:5173';
    
    const successRedirectUrl = `${ensureProtocol(frontendBase)}/payment/success?status=success`;
    const failureRedirectUrl = `${ensureProtocol(frontendBase)}/payment/failure?status=failure`;

    try {
        const { data } = req.query;
        if (!data) return res.redirect(`${failureRedirectUrl}&message=${encodeURIComponent('No data received.')}`);
        
        const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
        
        const verificationUrl = `https://rc-epay.esewa.com.np/api/epay/transaction/status/?product_code=${process.env.ESEWA_MERCHANT_CODE}&total_amount=${decodedData.total_amount}&transaction_uuid=${decodedData.transaction_uuid}`;
        
        const response = await fetch(verificationUrl);
        if (!response.ok) throw new Error(`eSewa verification check failed. Status: ${response.status}`);
        
        const verificationResponse = await response.json();

        if (verificationResponse.status.toUpperCase() === 'COMPLETE') {
            const payment = await Payment.findOne({ transaction_uuid: verificationResponse.transaction_uuid });
            if (!payment) return res.redirect(`${failureRedirectUrl}&message=${encodeURIComponent('Payment record not found.')}`);
            if (payment.status === 'success') return res.redirect(successRedirectUrl);

            payment.status = 'success';
            await payment.save();

            // --- SET EXPIRATION DATE ON SUCCESS ---
            const expirationDate = new Date();
            expirationDate.setMonth(expirationDate.getMonth() + 1); // Subscription lasts for 1 month

            const updatedUser = await User.findByIdAndUpdate(
                payment.userId, 
                { 
                    subscription: payment.plan,
                    subscriptionExpiresAt: expirationDate
                },
                { new: true }
            );

            if (!updatedUser) return res.redirect(`${failureRedirectUrl}&message=${encodeURIComponent('Account update failed.')}`);
            
            return res.redirect(successRedirectUrl);
        } else {
            await Payment.findOneAndUpdate({ transaction_uuid: decodedData.transaction_uuid }, { status: 'failure' });
            return res.redirect(`${failureRedirectUrl}&message=${encodeURIComponent(`Transaction status is ${verificationResponse.status}.`)}`);
        }
    } catch (error) {
        console.error('--- FATAL ERROR in verifyEsewaPayment ---', error);
        return res.redirect(`${failureRedirectUrl}&message=${encodeURIComponent('An internal server error occurred.')}`);
    }
};

// getTransactionHistory and getAllTransactionHistory remain the same...
exports.getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const payments = await Payment.find({ userId, status: 'success' }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: payments });
    } catch (error) {
        console.error("Get transaction history error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.getAllTransactionHistory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const status = req.query.status || 'all';
        const skip = (page - 1) * limit;

        // Build query
        let query = {};
        
        // Status filter
        if (status !== 'all') {
            query.status = status;
        }

        // Get all payments for search filtering (if search term provided)
        let allTransactions = await Payment.find(query)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        // Apply search filter if search term exists
        if (search) {
            const searchLower = search.toLowerCase();
            allTransactions = allTransactions.filter(transaction => {
                const userName = transaction.userId?.name?.toLowerCase() || '';
                const userEmail = transaction.userId?.email?.toLowerCase() || '';
                const transactionId = transaction.transaction_uuid?.toLowerCase() || '';
                const plan = transaction.plan?.toLowerCase() || '';
                
                return userName.includes(searchLower) ||
                       userEmail.includes(searchLower) ||
                       transactionId.includes(searchLower) ||
                       plan.includes(searchLower);
            });
        }

        // Get total count after filtering
        const total = allTransactions.length;
        
        // Apply pagination
        const paginatedTransactions = allTransactions.slice(skip, skip + limit);

        return res.status(200).json({
            success: true,
            data: paginatedTransactions,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch(error) {
        console.error('Get transaction history error ', error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}