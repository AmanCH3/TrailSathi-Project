// controllers/notificationController.js
const Notification = require('./../models/notification.model');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// GET /api/notifications?unread=true
exports.getMyNotifications = catchAsync(async (req, res, next) => {
  const filter = { user: req.user.id };

  // optional unread filter
  if (req.query.unread === 'true') {
    filter.read = false;
  }

  const notifications = await Notification.find(filter)
    .sort('-createdAt') // newest first
    .lean();

  res.status(200).json({
    status: 'success',
    results: notifications.length,
    data: {
      notifications,
    },
  });
});

// PATCH /api/notifications/:id/read
exports.markNotificationAsRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { read: true },
    { new: true }
  );

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      notification,
    },
  });
});

// PATCH /api/notifications/mark-all-read
exports.markAllAsRead = catchAsync(async (req, res, next) => {
  await Notification.updateMany(
    { user: req.user.id, read: false },
    { read: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'All notifications marked as read',
  });
});

// DELETE /api/notifications/:id
exports.deleteNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});


