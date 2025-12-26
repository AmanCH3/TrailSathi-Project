const express = require('express');
const notificationController = require('./../controllers/notificationController');
const { protect } = require('./../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', notificationController.getMyNotifications);
router.patch('/:id/read', notificationController.markAsRead);
router.post('/seed', notificationController.seedNotification); // Dev helper

module.exports = router;
