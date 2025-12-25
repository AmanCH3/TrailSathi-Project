const User = require('../models/user.model');
const SoloHike = require('../models/soloHike.model');
const Payment = require('../models/payment.model'); // Assuming this exists
const catchAsync = require('../utils/catchAsync');

exports.getAnalytics = catchAsync(async (req, res, next) => {
    // 1. Summary Stats
    const totalUsers = await User.countDocuments();
    const completedHikes = await SoloHike.countDocuments({ status: 'completed' });
    
    // Revenue - sum amount from payments
    const revenueStats = await Payment.aggregate([
        { $match: { status: 'COMPLETE' } }, // Adjust status based on actual model
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].total : 0;

    // 2. User Growth (Users joined per month)
    const currentYear = new Date().getFullYear();
    const userGrowth = await User.aggregate([
        {
            $project: {
                month: { $month: "$joinDate" }, // joinDate is active field
                year: { $year: "$joinDate" }
            }
        },
        { $match: { year: currentYear } },
        {
            $group: {
                _id: "$month",
                users: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // 3. Hike Data (Completed vs Cancelled per month)
    const hikeData = await SoloHike.aggregate([
        {
            $project: {
                month: { $month: "$startDateTime" },
                year: { $year: "$startDateTime" },
                status: 1
            }
        },
        { $match: { year: currentYear } },
        {
            $group: {
                _id: "$month",
                completed: { 
                    $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
                },
                cancelled: { 
                    $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] }
                }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Mock percentage changes for now (calculating last month vs this month is complex for MVP)
    const summary = {
        totalUsers: {
            total: totalUsers,
            percentageChange: 12.5 // Mock
        },
        completedHikes: {
            total: completedHikes,
            scheduledThisMonth: await SoloHike.countDocuments({ 
                status: 'planned',
                startDateTime: { 
                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
                }
            })
        },
        totalRevenue: {
            total: totalRevenue,
            percentageChange: 8.2 // Mock
        }
    };

    res.status(200).json({
        success: true,
        data: {
            summary,
            userGrowth,
            hikeData
        }
    });
});
