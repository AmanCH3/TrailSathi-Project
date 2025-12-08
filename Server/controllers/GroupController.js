const Group = require('../models/Group');
const GroupMembership = require('../models/GroupMembership');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

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

  const groups = await features.query;

  res.status(200).json({
    success: true,
    results: groups.length,
    data: {
      groups
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

  res.status(200).json({
    success: true,
    data: {
      group
    }
  });
});

exports.createGroup = catchAsync(async (req, res, next) => {
  const newGroup = await Group.create({
    ...req.body,
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
  // Logic: User must be in group.admins array (which stores ObjectIds)
  const isAdmin = group.admins.some(adminId => adminId.toString() === req.user.id);
  const isOwner = group.owner.toString() === req.user.id;

  if (!isOwner && !isAdmin) {
      return next(new AppError('You do not have permission to update this group', 403));
  }

  // Filter allowed fields
  const allowedUpdates = ['name', 'description', 'location', 'privacy', 'coverImage', 'tags'];
  const dataToUpdate = {};
  Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) dataToUpdate[key] = req.body[key];
  });

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
