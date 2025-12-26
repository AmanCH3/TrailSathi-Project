const Conversation = require('../models/Conversation');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getConversations = catchAsync(async (req, res, next) => {
    // Basic: Find conversations where user is a participant
    // This works for Direct Chats and Event Chats (if we add user to participants on join)
    const conversations = await Conversation.find({
        participants: req.user.id
    })
    .populate('participants', 'name profileImage') // to show who you are talking to
    .populate('relatedEvent', 'title startDateTime')
    .populate('relatedGroup', 'name') // Add this
    .sort('-lastMessageAt');

    res.status(200).json({
        success: true,
        results: conversations.length,
        data: { conversations }
    });
});

exports.createConversation = catchAsync(async (req, res, next) => {
    const { recipientId, relatedEventId, relatedGroupId } = req.body;

    let query = {};
    let createData = {};

    // 1. EVENT CHAT: One conversation per event (Open to all)
    if (relatedEventId) {
        query = { relatedEvent: relatedEventId };
        createData = {
            relatedEvent: relatedEventId,
            participants: [req.user.id], // Add creator initially, can add others dynamically or just ignore participants for public event chat
            type: 'event'
        };
    } 
    // 2. GROUP CHAT CONTEXT: (If we want to track it in conversation list)
    else if (relatedGroupId) {
         query = { relatedGroup: relatedGroupId };
         createData = {
            relatedGroup: relatedGroupId,
            participants: [req.user.id],
            type: 'group'
         };
    }
    // 3. DIRECT CHAT: Standard 1-on-1
    else if (recipientId) {
        query = {
            participants: { $all: [req.user.id, recipientId], $size: 2 },
            relatedGroup: null,
            relatedEvent: null
        };
        createData = {
            participants: [req.user.id, recipientId],
            unreadBy: [recipientId],
            type: 'direct'
        };
    } else {
        return next(new AppError('Recipient, Event, or Group ID required', 400));
    }

    let conversation = await Conversation.findOne(query);

    if (!conversation) {
        conversation = await Conversation.create(createData);
    } 
    // For Event/Group chats, make sure current user is in participants list if we track it?
    // Actually, for large groups, we shouldn't rely on 'participants' array for auth. 
    // But for listing in "My Conversations", we might need to add them.
    // Let's rely on 'getConversations' logic to find by Group Membership separately 
    // OR add them to participants if it's a small event/group. 
    // For now, I'll push user to participants if not there, for simple list compatibility.
    else if ((relatedEventId || relatedGroupId) && !conversation.participants.includes(req.user.id)) {
        conversation.participants.push(req.user.id);
        await conversation.save();
    }

    // Populate data before returning
    const populatedConversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name profileImage')
        .populate('relatedEvent', 'title startDateTime')
        .populate('relatedGroup', 'name');

    res.status(200).json({
        success: true,
        data: { conversation: populatedConversation }
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
