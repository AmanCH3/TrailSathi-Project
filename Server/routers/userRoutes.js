const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../middlewares/authMiddleware');
const dashboardController = require('./../controllers/dashboardController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);
router.put('/me', userController.getMe, userController.updateMe);
router.put('/me/picture', userController.uploadUserPhoto, userController.updateProfilePicture);
router.get('/dashboard', dashboardController.getMyDashboard);

module.exports = router;
