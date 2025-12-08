const express = require('express');
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

// /api/events OR /api/groups/:groupId/events
router.route('/')
    .get(authMiddleware.protect, eventController.getGroupEvents)
    .post(authMiddleware.protect, eventController.createEvent);

router.route('/:eventId')
    .get(authMiddleware.protect, eventController.getEvent)
    .put(authMiddleware.protect, eventController.updateEvent)
    .delete(authMiddleware.protect, eventController.deleteEvent);

router.post('/:eventId/attend', authMiddleware.protect, eventController.attendEvent);
router.post('/:eventId/unattend', authMiddleware.protect, eventController.unattendEvent);
router.get('/:eventId/attendees', authMiddleware.protect, eventController.getEventAttendees);

module.exports = router;
