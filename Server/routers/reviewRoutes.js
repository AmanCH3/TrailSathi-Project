const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.authorize('user'),
    reviewController.uploadReviewImages,
    reviewController.setTrailUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.authorize('user', 'admin'),
    reviewController.uploadReviewImages,
    reviewController.updateReview
  )
  .delete(
    authController.authorize('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
