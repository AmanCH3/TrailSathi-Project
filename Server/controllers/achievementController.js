const Achievement = require('./../models/achievement.model');
const User = require('./../models/user.model');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// ADMIN: create a new achievement
// POST /api/achievements
exports.createAchievement = catchAsync(async (req, res, next) => {
  let { name, code, description, icon } = req.body;

  if (!name || !code) {
    return next(
      new AppError('Please provide both name and code for the achievement.', 400)
    );
  }

  code = code.toUpperCase();

  const achievement = await Achievement.create({
    name,
    code,
    description,
    icon,
  });

  res.status(201).json({
    status: 'success',
    data: {
      achievement,
    },
  });
});

// PUBLIC / AUTH: get all achievements (for listing / info)
// GET /api/achievements
exports.getAllAchievements = catchAsync(async (req, res, next) => {
  const achievements = await Achievement.find().sort('name');

  res.status(200).json({
    status: 'success',
    results: achievements.length,
    data: {
      achievements,
    },
  });
});

// USER: get my unlocked achievements
// GET /api/achievements/me
exports.getMyAchievements = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: 'achievements',
    select: 'name code description icon',
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    totalUnlocked: user.achievements.length,
    data: {
      achievements: user.achievements,
    },
  });
});

// ADMIN: update an achievaement
// PATCH /api/achievements/:id
exports.updateAchievement = catchAsync(async (req, res, next) => {
  const updates = { ...req.body };

  if (updates.code) {
    updates.code = updates.code.toUpperCase();
  }

  const achievement = await Achievement.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!achievement) {
    return next(new AppError('No achievement found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      achievement,
    },
  });
});

// ADMIN: delete an achievement
// DELETE /api/achievements/:id
exports.deleteAchievement = catchAsync(async (req, res, next) => {
  const achievement = await Achievement.findByIdAndDelete(req.params.id);

  if (!achievement) {
    return next(new AppError('No achievement found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
