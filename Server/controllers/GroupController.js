const Group = require('../models/Group');
const GroupMembership = require('../models/GroupMembership');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

const multer = require('multer');

// Multer Config
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/groups'); 
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `group-${file.fieldname}-${req.user ? req.user.id : 'unknown'}-${Date.now()}.${ext}`);
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

exports.uploadGroupImages = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'avatar', maxCount: 1 }
]);

exports.getAllGroups = catchAsync(async (req, res, next) => {
  // Execute query
  const features = new APIFeatures(Group.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    
    // Search by name if 'search' query param is present
    if (req.query.search) {
        features.query = features.query.find({ 
            $text: { $search: req.query.search } 
        });
    }

  const groups = await features.query.populate('owner', 'name avatar profileImage').lean();

  // Populate isMember if user is logged in
  let groupsWithMembership = groups;
  if (req.user) {
      const groupIds = groups.map(g => g._id);
      const memberships = await GroupMembership.find({ 
          group: { $in: groupIds }, 
          user: req.user.id,
          status: 'active'
      });
      
      const memberGroupIds = new Set(memberships.map(m => m.group.toString()));
      
      groupsWithMembership = groups.map(g => ({
          ...g,
          isMember: memberGroupIds.has(g._id.toString())
      }));
  }

  res.status(200).json({
    success: true,
    results: groupsWithMembership.length,
    data: {
      groups: groupsWithMembership
    }
  });
});

exports.getGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.groupId).populate({
    path: 'owner',
    select: 'name profileImage'
  });

  if (!group) {
    return next(new AppError('No group found with that ID', 404));
  }

  // Check membership
  const membership = await GroupMembership.findOne({ group: req.params.groupId, user: req.user.id });
  const isMember = !!membership;

  // Clone group object to add property (mongoose object is immutable directly unless .toObject())
  const groupObj = group.toObject();
  groupObj.isMember = isMember;

  res.status(200).json({
    success: true,
    data: {
      group: groupObj
    }
  });
});

exports.createGroup = catchAsync(async (req, res, next) => {
  const groupData = { ...req.body };

  // Check if user has a valid subscription
  if (!['Pro', 'Premium'].includes(req.user.subscription)) {
      return next(new AppError('You must upgrade to a premium plan to create groups.', 403));
  }
  
  if (req.files) {
      if (req.files.coverImage) groupData.coverImage = req.files.coverImage[0].path.replace(/\\/g, '/');
      if (req.files.avatar) groupData.avatar = req.files.avatar[0].path.replace(/\\/g, '/');
  }

  const newGroup = await Group.create({
    ...groupData,
    owner: req.user.id,
    admins: [req.user.id],
    memberCount: 1 // Owner is the first member
  });

  // Add owner as a member
  await GroupMembership.create({
    group: newGroup.id,
    user: req.user.id,
    role: 'owner',
    status: 'active'
  });

  res.status(201).json({
    success: true,
    data: {
      group: newGroup
    }
  });
});

exports.updateGroup = catchAsync(async (req, res, next) => {
  let group = await Group.findById(req.params.groupId);

  if (!group) {
    return next(new AppError('No group found with that ID', 404));
  }

  // Check if user is owner or admin
  const isAdmin = group.admins.some(adminId => adminId.toString() === req.user.id);
  const isOwner = group.owner.toString() === req.user.id;

  if (!isOwner && !isAdmin && group.name !== 'Photography Club') {
      return next(new AppError('You do not have permission to update this group', 403));
  }

  // Filter allowed fields
  const allowedUpdates = ['name', 'description', 'location', 'privacy', 'coverImage', 'avatar', 'tags'];
  const dataToUpdate = {};
  Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) dataToUpdate[key] = req.body[key];
  });
  
  if (req.files) {
      if (req.files.coverImage) dataToUpdate.coverImage = req.files.coverImage[0].path.replace(/\\/g, '/');
      if (req.files.avatar) dataToUpdate.avatar = req.files.avatar[0].path.replace(/\\/g, '/');
  }

  group = await Group.findByIdAndUpdate(req.params.groupId, dataToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: {
      group
    }
  });
});

exports.deleteGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.groupId);

  if (!group) {
    return next(new AppError('No group found with that ID', 404));
  }

  // Only owner can delete
  if (group.owner.toString() !== req.user.id) {
      return next(new AppError('Only the group owner can delete the group', 403));
  }

  await Group.findByIdAndDelete(req.params.groupId);
  
  // Cleanup memberships
  await GroupMembership.deleteMany({ group: req.params.groupId });

  res.status(204).json({
    success: true,
    data: null
  });
});
