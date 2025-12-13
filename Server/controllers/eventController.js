const Event = require('../models/Event');
const EventAttendance = require('../models/EventAttendance');
const Group = require('../models/Group');
const GroupMembership = require('../models/GroupMembership');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

// Helper
const checkGroupAdmin = async (groupId, userId) => {
    const membership = await GroupMembership.findOne({ group: groupId, user: userId });
    return membership && (membership.role === 'admin' || membership.role === 'owner');
};

exports.getGroupEvents = catchAsync(async (req, res, next) => {
    const { groupId } = req.params;
    
    // Check access? Similar to posts.
    // Assuming visible to all or members if private.
    
    const features = new APIFeatures(Event.find({ group: groupId }), req.query)
        .filter()
        .sort()
        .paginate();

    if (!req.query.sort) {
        features.query = features.query.sort('startDateTime'); // Chronological usually better for events
    }

    const events = await features.query;

    res.status(200).json({
        success: true,
        results: events.length,
        data: { events }
    });
});

exports.createEvent = catchAsync(async (req, res, next) => {
    const { groupId } = req.params;

    const isAdmin = await checkGroupAdmin(groupId, req.user.id);
    if (!isAdmin) {
        return next(new AppError('Only group admins/owners can create events.', 403));
    }

    const newEvent = await Event.create({
        ...req.body,
        group: groupId,
        host: req.user.id
    });

    await Group.findByIdAndUpdate(groupId, { $inc: { upcomingEventCount: 1 } });

    res.status(201).json({
        success: true,
        data: { event: newEvent }
    });
});

exports.getEvent = catchAsync(async (req, res, next) => {
    const event = await Event.findById(req.params.eventId)
        .populate('host', 'name profileImage')
        .populate('group', 'name');

    if (!event) return next(new AppError('Event not found', 404));

    res.status(200).json({
        success: true,
        data: { event }
    });
});

exports.updateEvent = catchAsync(async (req, res, next) => {
    const event = await Event.findById(req.params.eventId);
    if (!event) return next(new AppError('Event not found', 404));

    // Host OR Group Admin
    let isAuthorized = event.host.toString() === req.user.id;
    if (!isAuthorized) {
        isAuthorized = await checkGroupAdmin(event.group, req.user.id);
    }

    if (!isAuthorized) return next(new AppError('Permission denied', 403));

    const updatedEvent = await Event.findByIdAndUpdate(req.params.eventId, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: { event: updatedEvent }
    });
});

exports.deleteEvent = catchAsync(async (req, res, next) => {
    const event = await Event.findById(req.params.eventId);
    if (!event) return next(new AppError('Event not found', 404));

    let isAuthorized = event.host.toString() === req.user.id;
    if (!isAuthorized) {
        isAuthorized = await checkGroupAdmin(event.group, req.user.id);
    }

    if (!isAuthorized) return next(new AppError('Permission denied', 403));

    await Event.findByIdAndDelete(req.params.eventId);
    
    // Decrement count? If upcoming. 
    // Logic: check if event.status is Upcoming. 
    await Group.findByIdAndUpdate(event.group, { $inc: { upcomingEventCount: -1 } });

    res.status(204).json({ success: true, data: null });
});

exports.attendEvent = catchAsync(async (req, res, next) => {
    const { eventId } = req.params;

    const existing = await EventAttendance.findOne({ event: eventId, user: req.user.id });
    if (existing) {
        return next(new AppError('You are already attending or interested', 400));
    }

    await EventAttendance.create({
        event: eventId,
        user: req.user.id,
        status: 'going'
    });

    await Event.findByIdAndUpdate(eventId, { $inc: { participantsCount: 1 } });

    res.status(200).json({ success: true, message: 'Marked as going' });
});

exports.unattendEvent = catchAsync(async (req, res, next) => {
    const { eventId } = req.params;

    const attendance = await EventAttendance.findOneAndDelete({ event: eventId, user: req.user.id });
    if (!attendance) return next(new AppError('You are not attending this event', 400));

    await Event.findByIdAndUpdate(eventId, { $inc: { participantsCount: -1 } });

    res.status(200).json({ success: true, message: 'Attendance removed' });
});

exports.getEventAttendees = catchAsync(async (req, res, next) => {
    const attendees = await EventAttendance.find({ event: req.params.eventId })
        .populate('user', 'name profileImage');

    res.status(200).json({
        success: true,
        results: attendees.length,
        data: { attendees }
    });
});
