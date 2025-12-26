const express = require('express');
const activityController = require('../controllers/activityController');
const authController = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authController.protect);
router.get('/', activityController.getRecentActivity);
router.get('/user/:userId', authController.authorize('admin'), activityController.getUserActivity);

module.exports = router;
