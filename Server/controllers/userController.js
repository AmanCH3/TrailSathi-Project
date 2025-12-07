const User = require('./../models/user.model');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .populate({
      path: 'completedTrails.trail',
      select: 'name location difficulty length'
    })
    .populate({
      path: 'joinedTrails.trail',
      select: 'name location difficulty length'
    });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});



