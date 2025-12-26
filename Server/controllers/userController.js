const multer = require('multer');
const User = require('./../models/user.model');
const SoloHike = require('./../models/soloHike.model');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

// Multer Config for Profile Images
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('profileImage');

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
      select: 'name location difficulty length elevationGain duration'
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
      _id: hike._id, // CHANGED from soloHikeId to _id for frontend compatibility
      soloHikeId: hike._id, 
      status: hike.status
  }));

  res.status(200).json({
    success: true,
    data: userObj
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = exports.filterObj(req.body, 'name', 'email', 'bio', 'phone', 'emergencyContact', 'hikerType');
  if (req.file) filteredBody.profileImage = req.file.path.replace(/\\/g, '/'); // Normalize path
  if (req.body.profileImage) filteredBody.profileImage = req.body.profileImage;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: updatedUser
  });
});

exports.updateProfilePicture = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('Please provide an image', 400));
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        profileImage: req.file.path.replace(/\\/g, '/')
    }, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: updatedUser
    });
});

// Admin: Get all users with pagination and search
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    // Build search query
    let query = {};
    if (search) {
        query = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        };
    }

    // Get total count for pagination
    const total = await User.countDocuments(query);
    
    // Get users with pagination
    const users = await User.find(query)
        .select('-password -passwordResetToken -passwordResetExpires')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: users,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    });
});

// Admin: Update any user
exports.updateUser = catchAsync(async (req, res, next) => {
    // Filter allowed fields for admin update
    const allowedFields = ['name', 'email', 'role', 'subscription', 'status'];
    const filteredBody = {};
    
    Object.keys(req.body).forEach(key => {
        if (allowedFields.includes(key)) {
            filteredBody[key] = req.body[key];
        }
    });

    const user = await User.findByIdAndUpdate(req.params.id, filteredBody, {
        new: true,
        runValidators: true
    }).select('-password');

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// Admin: Delete user
exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        data: null
    });
});

