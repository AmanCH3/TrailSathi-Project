const User = require('./../models/user.model');
const SoloHike = require('./../models/soloHike.model');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = catchAsync(async (req, res, next) => {
  // 1. Find the User
  const user = await User.findById(req.params.id)
    .populate({
      path: 'completedTrails.trail',
      select: 'name location difficulty length'
    });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  // 2. Find Planned SoloHikes for this User (Source of Truth for "Joined")
  const soloHikes = await SoloHike.find({ 
    user: req.params.id, 
    status: 'planned' 
  }).populate('trail');

  // 3. Convert User Document to Object and Inject SoloHikes as joinedTrails
  const userObj = user.toObject();
  
  userObj.joinedTrails = soloHikes.map(hike => ({
      trail: hike.trail,
      scheduledDate: hike.startDateTime,
      soloHikeId: hike._id, // Adding ID for potential future use (cancelling etc)
      status: hike.status
  }));

  res.status(200).json({
    success: true,
    data: userObj
  });
});
