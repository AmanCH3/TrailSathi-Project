// routes/achievementRoutes.js
const express = require('express');
const { protect, authorize } = require('./../middlewares/authMiddleware');
const achievementController = require('./../controllers/achievementController');

const router = express.Router();

// All routes below require authentication for now
router.use(protect);

// USER: get my unlocked achievements
// GET /api/achievements/me
router.get('/me', achievementController.getMyAchievements);

// PUBLIC (logged-in) list of all possible achievements
// GET /api/achievements
router.get('/', achievementController.getAllAchievements);

// ADMIN-ONLY routes
router.use(authorize('admin'));

// POST /api/achievements
router.post('/', achievementController.createAchievement);

// PATCH /api/achievements/:id
// DELETE /api/achievements/:id
router
  .route('/:id')
  .patch(achievementController.updateAchievement)
  .delete(achievementController.deleteAchievement);

module.exports = router;
