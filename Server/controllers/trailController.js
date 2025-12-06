const multer = require('multer');
const Trail = require('./../models/trail.model');
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
  const features = new APIFeatures(Trail.find(), req.query)
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
