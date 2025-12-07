// routes/notificationRoutes.js
const express = require('express');
const { protect } = require('./../middlewares/authMiddleware');
const notificationController = require('./../controllers/notificationController');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(notificationController.getMyNotifications);

// PATCH /api/notifications/mark-all-read
router
  .route('/mark-all-read')
  .patch(notificationController.markAllAsRead);

// PATCH /api/notifications/:id/read
router
  .route('/:id/read')
  .patch(notificationController.markNotificationAsRead);

// DELETE /api/notifications/:id
router
  .route('/:id')
  .delete(notificationController.deleteNotification);

module.exports = router;
