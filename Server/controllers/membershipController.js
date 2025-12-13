const Group = require('../models/Group');
const GroupMembership = require('../models/GroupMembership');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.joinGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.groupId);
  if (!group) {
    return next(new AppError('No group found with that ID', 404));
  }

  // Check if already a member
  const existingMembership = await GroupMembership.findOne({
    group: req.params.groupId,
    user: req.user.id
  });

  if (existingMembership) {
    return next(new AppError('You are already a member of this group', 400));
  }

  // Create membership
  await GroupMembership.create({
    group: req.params.groupId,
    user: req.user.id,
    role: 'member',
    status: 'active' // For public groups. logic for private could go here (e.g. pending)
  });

  // Increment memberCount
  group.memberCount = group.memberCount + 1;
  await group.save();

  res.status(200).json({
    success: true,
    message: 'Joined group successfully'
  });
});

exports.leaveGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.groupId);
  if (!group) {
    return next(new AppError('No group found with that ID', 404));
  }

  const membership = await GroupMembership.findOneAndDelete({
    group: req.params.groupId,
    user: req.user.id
  });

  if (!membership) {
    return next(new AppError('You are not a member of this group', 400));
  }

  // Decrement memberCount
  // Ensure we don't go below 0 (though logic shouldn't allow it)
  group.memberCount = Math.max(0, group.memberCount - 1);
  await group.save();

  res.status(200).json({
    success: true,
    message: 'Left group successfully'
  });
});

exports.getGroupMembers = catchAsync(async (req, res, next) => {
    // Simple pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;

    const members = await GroupMembership.find({ group: req.params.groupId })
        .skip(skip)
        .limit(limit)
        .populate({
            path: 'user',
            select: 'name profileImage bio' // Basic user info
        });
    
    // Get count for pagination
    const count = await GroupMembership.countDocuments({ group: req.params.groupId });

    res.status(200).json({
        success: true,
        results: members.length,
        total: count,
        data: {
            members
        }
    });
});
