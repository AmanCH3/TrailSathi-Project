const Conversation = require('../models/Conversation');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getConversations = catchAsync(async (req, res, next) => {
    const conversations = await Conversation.find({
        participants: req.user.id
    })
    .populate('participants', 'name profileImage') // to show who you are talking to
    .populate('relatedEvent', 'title startDateTime')
    .sort('-lastMessageAt');

    res.status(200).json({
        success: true,
        results: conversations.length,
        data: { conversations }
    });
});

exports.createConversation = catchAsync(async (req, res, next) => {
    const { recipientId, relatedEventId } = req.body;

    // Check if conversation already exists between these two users
    const query = {
        participants: { $all: [req.user.id, recipientId], $size: 2 },
        relatedGroup: null
    };

    if (relatedEventId) {
        query.relatedEvent = relatedEventId;
    } else {
        query.relatedEvent = null;
    }

    let conversation = await Conversation.findOne(query);

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [req.user.id, recipientId],
            unreadBy: [recipientId],
            relatedEvent: relatedEventId || null
        });
    }

    res.status(200).json({
        success: true,
        data: { conversation }
    });
});

exports.getConversation = catchAsync(async (req, res, next) => {
    const conversation = await Conversation.findById(req.params.conversationId)
        .populate('participants', 'name profileImage')
        .populate('relatedEvent', 'title startDateTime');
        
    if (!conversation) return next(new AppError('Conversation not found', 404));

    // Security check: user must be participant
    const isParticipant = conversation.participants.some(p => p._id.toString() === req.user.id);
    if (!isParticipant) return next(new AppError('Access denied', 403));

    res.status(200).json({
        success: true,
        data: { conversation }
    });
});
