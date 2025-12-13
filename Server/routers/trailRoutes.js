const express = require('express');
const trailController = require('./../controllers/trailController');
const authController = require('./../middlewares/authMiddleware');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// POST /trail/234fad4/reviews
// GET /trail/234fad4/reviews
router.use('/:trailId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(trailController.aliasTopTrails, trailController.getAllTrails);

router
  .route('/trails-within/:distance/center/:latlng/unit/:unit')
  .get(trailController.getTrailsWithin);
// /trails-within?distance=233&center=-40,45&unit=mi
// /trails-within/233/center/-40,45/unit/mi

// Dedicated Gallery Routes (Place specific routes before parameter routes)
router
  .route('/:id/gallery-images')
  .get(trailController.getGalleryImages)
  .post(
    authController.protect,
    (req, res, next) => {
        console.log('Trail Gallery Route Hit', req.params.id);
        next();
    },
    trailController.uploadGalleryImages,
    trailController.addGalleryImages
  );

router.route('/distances/:latlng/unit/:unit').get(trailController.getDistances);

router
  .route('/')
  .get(trailController.getAllTrails)
  .post(
    authController.protect,
    authController.authorize('admin'),
    trailController.uploadTrailImages,
    trailController.createTrail
  );

 
router
  .route('/:id')
  .get(trailController.getTrail)
  .patch(
    authController.protect,
    authController.authorize('admin'),
    trailController.uploadTrailImages,
    trailController.updateTrail
  )
  .delete(
    authController.protect,
    authController.authorize('admin'),
    trailController.deleteTrail
  );

// Join Trail Routes
router
  .route('/:id/join-with-date')
  .post(
    authController.protect,
    trailController.joinTrailWithDate
  );

router
  .route('/joined/:id/complete')
  .post(
    authController.protect,
    trailController.completeTrail
  );

router
  .route('/joined/:id/cancel')
  .delete(
    authController.protect,
    trailController.cancelJoinedTrail
  );

// Dedicated Gallery Routes - MOVED TO TOP

module.exports = router;
