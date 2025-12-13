const express = require('express');
const soloHikeController = require('./../controllers/soloHikeController');
const authController = require('./../middlewares/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

router
  .route('/')
  .post(soloHikeController.createSoloHike);

router
  .route('/mine')
  .get(soloHikeController.getMySoloHikes);

router
  .route('/:id/status')
  .patch(soloHikeController.updateSoloHikeStatus);

module.exports = router;
