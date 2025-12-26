const multer = require('multer');
const Trail = require('./../models/trail.model');
const SoloHike = require('./../models/soloHike.model');
const User = require('./../models/user.model');
const Notification = require('./../models/notification.model');
const sendEmail = require('./../utils/email');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/trails');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `trail-${req.user ? req.user.id : 'admin'}-${Date.now()}.${ext}`);
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

exports.uploadTrailImages = upload.array('images', 5);

exports.aliasTopTrails = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,difficulty';
  req.query.fields = 'name,difficulty,ratingsAverage,description,difficulty';
  next();
};

exports.getAllTrails = catchAsync(async (req, res, next) => {
  // Custom Filtering Logic
  const filter = {};
  const queryObj = { ...req.query }; // Create a copy for APIFeatures

  // 1. Search (Name or Location)
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    filter.$or = [
      { name: searchRegex },
      { location: searchRegex }
    ];
    delete queryObj.search;
  }

  // 2. Max Distance -> length
  if (req.query.maxDistance) {
    filter.length = { $lte: parseFloat(req.query.maxDistance) };
    delete queryObj.maxDistance;
  }

  // 3. Max Elevation -> elevationGain
  if (req.query.maxElevation) {
    filter.elevationGain = { $lte: parseFloat(req.query.maxElevation) };
    delete queryObj.maxElevation;
  }

  // 4. Max Duration -> duration
  if (req.query.maxDuration) {
    filter.duration = { $lte: parseFloat(req.query.maxDuration) };
    delete queryObj.maxDuration;
  }

  // 5. Difficulty 'All' handling
  if (req.query.difficulty === 'All') {
    delete queryObj.difficulty;
  }

  const features = new APIFeatures(Trail.find(filter), queryObj)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const trails = await features.query;

  res.status(200).json({
    status: 'success',
    results: trails.length,
    data: {
      trails
    }
  });
});

exports.getTrail = catchAsync(async (req, res, next) => {
  const trail = await Trail.findById(req.params.id).populate('reviews');

  if (!trail) {
    return next(new AppError('No trail found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      trail
    }
  });
});

// Gallery Images Logic
exports.uploadGalleryImages = upload.array('images', 10);

exports.addGalleryImages = catchAsync(async (req, res, next) => {
  console.log('Using addGalleryImages - Files:', req.files ? req.files.length : 'None');
  
  if (!req.files || req.files.length === 0) {
      console.log('No files uploaded');
      return next(new AppError('No images uploaded. Please check your selection.', 400));
  }

  const trail = await Trail.findById(req.params.id);
  if (!trail) {
      console.log('Trail not found:', req.params.id);
      return next(new AppError('No trail found', 404));
  }
  
  console.log('Found trail:', trail.name);

  // Check if galleryImages array exists (schema update check)
  if (!trail.galleryImages) {
       console.log('Schema mismatch: galleryImages field missing on trail doc. Initialize it.');
       trail.galleryImages = [];
  }

  const newImages = req.files.map(file => ({
    url: file.path, 
    user: req.user.id
  }));

  trail.galleryImages.push(...newImages);
  await trail.save({ validateBeforeSave: false }); // validation might fail if other fields are missing/stale on this doc

  res.status(200).json({
    status: 'success',
    data: {
      message: 'Images uploaded to gallery'
    }
  });
});

exports.getGalleryImages = catchAsync(async (req, res, next) => {
  const trail = await Trail.findById(req.params.id).populate({
    path: 'galleryImages.user',
    select: 'name profileImage'
  });

  if (!trail) return next(new AppError('No trail found', 404));

  res.status(200).json({
    status: 'success',
    results: trail.galleryImages.length,
    data: {
      images: trail.galleryImages
    }
  });
});

exports.createTrail = catchAsync(async (req, res, next) => {
  if (req.files) {
    req.body.images = req.files.map(file => file.path);
  }
  
  const newTrail = await Trail.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      trail: newTrail
    }
  });
});

exports.updateTrail = catchAsync(async (req, res, next) => {
  if (req.files) {
    req.body.images = req.files.map(file => file.path);
  }

  const trail = await Trail.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!trail) {
    return next(new AppError('No trail found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      trail
    }
  });
});

exports.deleteTrail = catchAsync(async (req, res, next) => {
  const trail = await Trail.findByIdAndDelete(req.params.id);

  if (!trail) {
    return next(new AppError('No trail found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// /trails-within/:distance/center/:latlng/unit/:unit
// /trails-within/233/center/34.111, -118.111/unit/mi
exports.getTrailsWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const trails = await Trail.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: trails.length,
    data: {
      data: trails
    }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await Trail.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});

exports.joinTrailWithDate = catchAsync(async (req, res, next) => {
  const { date, scheduledDate } = req.body; 
  const { id } = req.params; 
  const hikeDate = date || scheduledDate;

  if (!hikeDate) {
    return next(new AppError('Please provide a date for the hike.', 400));
  }

  // 1. Check if trail exists (need name for notification)
  const trail = await Trail.findById(id);
  if (!trail) {
      return next(new AppError('Trail not found.', 404));
  }

  // 2. Create SoloHike
  const newSoloHike = await SoloHike.create({
    user: req.user.id,
    trail: id,
    startDateTime: hikeDate,
    status: 'planned'
  });

  // 3. Create In-App Notification
  await Notification.create({
    recipient: req.user.id,
    type: 'system',
    title: 'Hike Scheduled!',
    message: `You have successfully scheduled a hike on ${trail.name} for ${new Date(hikeDate).toDateString()}.`,
    link: `/trails/${trail._id}`
  });

  // 4. Update User's Joined Trails (Refactored to document pattern for achievement check)
  const user = await User.findById(req.user.id);
  
  // Add subdoc if not exists
  const alreadyJoined = user.joinedTrails.some(jt => jt.trail.toString() === trail._id.toString());
  if (!alreadyJoined) {
     user.joinedTrails.push({
           trail: trail._id,
           scheduledDate: hikeDate 
     });
     // Increment stats
     user.stats.hikesJoined += 1; // Assuming we track this
  }
  
  // Check Achievements (First Steps)
  await checkAndUnlockAchievements(user);
  await user.save({ validateBeforeSave: false });

  // 5. Send Confirmation Email
  try {
    await sendEmail({
      email: req.user.email,
      subject: 'Hike Scheduled Confirmation - TrailSathi',
      message: `Hello ${req.user.name},\n\nYou have successfully scheduled a hike on ${trail.name}.\nDate: ${new Date(hikeDate).toDateString()}\n\nHappy Hiking!\nThe TrailSathi Team`
    });
  } catch (err) {
    console.error('Failed to send email:', err);
  }

  res.status(201).json({
    status: 'success',
    message: 'Hike scheduled successfully! Confirmation email sent.',
    data: {
      soloHike: newSoloHike
    }
  });
});

const { checkAndUnlockAchievements } = require('./../utils/achievementUtils');

// ... (existing imports, but inserted new one at top usually)

exports.completeTrail = catchAsync(async (req, res, next) => {
  // 1. Find the scheduled SoloHike for this user and trail
  const soloHike = await SoloHike.findOne({
      user: req.user.id,
      trail: req.params.id,
      status: 'planned'
  }).populate('trail');

  if (!soloHike) {
    return next(new AppError('No active planned hike found for this trail.', 404));
  }
  
  // Update status
  soloHike.status = 'completed';
  soloHike.endDateTime = Date.now();
  await soloHike.save();

  // 2. Update User's Completed Trails and Stats
  const user = await User.findById(req.user.id);
  
  // Add to completedTrails if not already there
  const isAlreadyCompleted = user.completedTrails.some(ct => ct.trail.toString() === soloHike.trail._id.toString());
  
  if (!isAlreadyCompleted) {
      user.completedTrails.push({
          trail: soloHike.trail._id,
          completedAt: Date.now()
      });

      // Update Stats
      user.stats.totalHikes += 1;
      user.stats.totalDistance += soloHike.trail.length || 0;
      user.stats.totalElevation += soloHike.trail.elevationGain || 0;
      user.stats.totalHours += soloHike.trail.duration || 0;
  }

  // Remove from joinedTrails
  user.joinedTrails = user.joinedTrails.filter(jt => jt.trail.toString() !== soloHike.trail._id.toString());
  
  // Check for Achievements
  await checkAndUnlockAchievements(user);

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Trail marked as complete!',
    data: {
      soloHike,
      stats: user.stats
    }
  });
});

exports.cancelJoinedTrail = catchAsync(async (req, res, next) => {
  const soloHike = await SoloHike.findByIdAndDelete(req.params.id);

  if (!soloHike) {
    return next(new AppError('No scheduled hike found with that ID.', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
