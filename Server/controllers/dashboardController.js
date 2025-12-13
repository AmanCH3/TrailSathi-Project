// controllers/dashboard.controller.js
const User = require("../models/user.model");
const SoloHike = require("../models/soloHike.model");
const catchAsync = require("../utils/catchAsync");

exports.getMyDashboard = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .select("name profileImage hikerType joinDate stats achievements")
      .populate({
        path: "achievements",
        select: "name code description icon",
      });

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Upcoming solo hikes (next 3)
    const now = new Date();
    const upcomingSoloHikes = await SoloHike.find({
      user: userId,
      status: "planned",
      startDateTime: { $gte: now },
    })
      .populate("trail", "name difficulty location length")
      .sort({ startDateTime: 1 })
      .limit(3)
      .lean();

    // Recent completed hikes (last 5)
    const recentCompletedSoloHikes = await SoloHike.find({
      user: userId,
      status: "completed",
    })
      .populate("trail", "name difficulty location length elevationGain")
      .sort({ endDateTime: -1 })
      .limit(5)
      .lean();

    // Favourite difficulty (via aggregate)
    const difficultyStats = await SoloHike.aggregate([
      {
        $match: {
          user: user._id,
          status: "completed",
        },
      },
      {
        $lookup: {
          from: "trails",
          localField: "trail",
          foreignField: "_id",
          as: "trail",
        },
      },
      { $unwind: "$trail" },
      {
        $group: {
          _id: "$trail.difficulty",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    const favouriteDifficulty =
      difficultyStats.length > 0 ? difficultyStats[0]._id : null;

    return res.json({
      profile: {
        name: user.name,
        profileImage: user.profileImage,
        hikerType: user.hikerType,
        joinDate: user.joinDate,
      },
      stats: user.stats || {},
      achievements: user.achievements || [],
      analytics: {
        favouriteDifficulty,
        totalAchievements: user.achievements.length,
      },
      upcomingSoloHikes,
      recentCompletedSoloHikes,
    });
});
