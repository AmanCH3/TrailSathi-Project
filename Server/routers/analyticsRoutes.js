const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const authController = require('../middlewares/authMiddleware'); // Verify path

const router = express.Router();

router.use(authController.protect);
// router.use(authController.restrictTo('admin')); // Restrict to admin?

router.get('/', analyticsController.getAnalytics);

module.exports = router;
