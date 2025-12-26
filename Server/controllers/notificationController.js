const Notification = require('./../models/notification.model');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getMyNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find({ recipient: req.user.id }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: notifications.length,
    data: {
      notifications
    }
  });
});

exports.markAsRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, {
    new: true,
    runValidators: true
  });

  if (!notification) {
    return next(new AppError('No notification found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      notification
    }
  });
});

// Internal helper to create notification (for future use by other controllers)
exports.createNotification = async ({ recipient, title, message, type, link }) => {
    try {
        await Notification.create({ recipient, title, message, type, link });
    } catch (err) {
        console.error("Failed to create notification:", err);
    }
};

// Seed Notification for demo
exports.seedNotification = catchAsync(async (req, res, next) => {
    await Notification.create({
        recipient: req.user.id,
        title: "Welcome to TrailSathi!",
        message: "Thanks for joining. Start exploring trails now!",
        type: "system",
        isRead: false
    });
    res.status(200).json({ status: 'success', message: 'Seeded' });
});
