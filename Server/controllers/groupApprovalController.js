const Group = require('../models/Group');
const GroupMembership = require('../models/GroupMembership');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get all pending groups (Admin only)
exports.getPendingGroups = catchAsync(async (req, res, next) => {
  const pendingGroups = await Group.find({ status: 'pending' })
    .populate('owner', 'name email profileImage')
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    results: pendingGroups.length,
    data: {
      groups: pendingGroups
    }
  });
});

// Get user's own pending groups
exports.getMyPendingGroups = catchAsync(async (req, res, next) => {
  const myPendingGroups = await Group.find({ 
    owner: req.user.id,
    status: 'pending'
  })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    results: myPendingGroups.length,
    data: {
      groups: myPendingGroups
    }
  });
});

// Approve a group (Admin only)
exports.approveGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.groupId);

  if (!group) {
    return next(new AppError('No group found with that ID', 404));
  }

  if (group.status === 'approved') {
    return next(new AppError('This group is already approved', 400));
  }

  group.status = 'approved';
  group.reviewedBy = req.user.id;
  group.approvalDate = Date.now();
  await group.save();

  // Send notification to group owner
  await Notification.create({
    user: group.owner,
    type: 'group_approved',
    message: `Your group "${group.name}" has been approved by admin`,
    relatedGroup: group._id
  });

  res.status(200).json({
    success: true,
    message: 'Group approved successfully',
    data: {
      group
    }
  });
});

// Reject a group (Admin only)
exports.rejectGroup = catchAsync(async (req, res, next) => {
  const { reason } = req.body;

  if (!reason) {
    return next(new AppError('Please provide a reason for rejection', 400));
  }

  const group = await Group.findById(req.params.groupId);

  if (!group) {
    return next(new AppError('No group found with that ID', 404));
  }

  if (group.status === 'rejected') {
    return next(new AppError('This group is already rejected', 400));
  }

  group.status = 'rejected';
  group.reviewedBy = req.user.id;
  group.rejectionReason = reason;
  group.approvalDate = Date.now();
  await group.save();

  // Send notification to group owner
  await Notification.create({
    user: group.owner,
    type: 'group_rejected',
    message: `Your group "${group.name}" was rejected. Reason: ${reason}`,
    relatedGroup: group._id
  });

  res.status(200).json({
    success: true,
    message: 'Group rejected successfully',
    data: {
      group
    }
  });
});

module.exports = exports;
