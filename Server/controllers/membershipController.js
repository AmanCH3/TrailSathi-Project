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

exports.requestToJoinGroup = catchAsync(async (req, res, next) => {
    const group = await Group.findById(req.params.groupId);
    if (!group) return next(new AppError('No group found', 404));

    // Check existing
    const existing = await GroupMembership.findOne({
        group: req.params.groupId,
        user: req.user.id
    });
    if (existing) {
        if (existing.status === 'pending') return next(new AppError('Request already pending', 400));
        return next(new AppError('Already a member', 400));
    }

    await GroupMembership.create({
        group: req.params.groupId,
        user: req.user.id,
        role: 'member',
        status: 'pending',
        message: req.body.message || '' 
    });

    res.status(200).json({ success: true, message: 'Request sent successfully' });
});

exports.getAllPendingRequests = catchAsync(async (req, res, next) => {
    const requests = await GroupMembership.find({ status: 'pending' })
        .populate({
            path: 'group',
            select: 'name description memberCount'
        })
        .populate('user', 'name profileImage')
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        data: requests
    });
});

exports.approveJoinRequest = catchAsync(async (req, res, next) => {
    const { groupId, requestId } = req.params;
    
    const membership = await GroupMembership.findById(requestId);
    if (!membership) return next(new AppError('Request not found', 404));

    membership.status = 'active';
    await membership.save();

    await Group.findByIdAndUpdate(groupId, { $inc: { memberCount: 1 } });

    res.status(200).json({ success: true, message: 'Request approved', data: { groupId } });
});

exports.denyJoinRequest = catchAsync(async (req, res, next) => {
    const { groupId, requestId } = req.params;
    
    const membership = await GroupMembership.findByIdAndDelete(requestId);
    if (!membership) return next(new AppError('Request not found', 404));

    res.status(200).json({ success: true, message: 'Request denied', data: { groupId } });
});
