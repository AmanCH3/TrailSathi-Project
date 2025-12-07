const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');



// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            role
        });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        console.log(req.body)
        const { email, password } = req.body;
        

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({ success: true, data: {} });
};



// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  console.log('📩 /forgot-password hit, body =', req.body);

  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'There is no user with that email' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', otp, 'for user:', user.email);

    // Save OTP to database
    user.passwordResetOTP = otp;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const message = `Your password reset OTP is ${otp}. It is valid for 10 minutes.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset OTP',
            message
        });

        res.status(200).json({
            success: true,
            message: 'OTP sent to email!'
        });
    } catch (err) {
        console.error('Send Email Error:', err);
        user.passwordResetOTP = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return res.status(500).json({ success: false, message: 'Email could not be sent', error: err.message });
    }
  } catch (err) {
    console.error('❌ forgotPassword error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
// @desc    Reset Password
// @route   PUT /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
    try {
        const { email, otp, password, confirmPassword } = req.body;

        if (!email || !otp || !password || !confirmPassword) {
            return res.status(400).json({ success: false, message: 'Please provide all fields' });
        }

        if (password !== confirmPassword) {
             return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }

        const user = await User.findOne({
            email,
            passwordResetOTP: otp,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid OTP or OTP has expired' });
        }

        user.password = password;
        user.passwordResetOTP = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);

    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
};
