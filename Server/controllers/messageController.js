const Message = require('../models/Message');
const GroupMessage = require('../models/GroupMessage');
const Conversation = require('../models/Conversation');
const GroupMembership = require('../models/GroupMembership'); // Check membership for group chat
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

// DM Methods

exports.getMessages = catchAsync(async (req, res, next) => {
    const { conversationId } = req.params;

    // Check participation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return next(new AppError('Conversation not found', 404));
    
    // Check if user is participant
    const isParticipant = conversation.participants.includes(req.user.id);
    if (!isParticipant) return next(new AppError('Access denied', 403));

    const features = new APIFeatures(Message.find({ conversation: conversationId }), req.query)
        .sort()
        .paginate();
        
    if (!req.query.sort) features.query = features.query.sort('sentAt');

    const messages = await features.query.populate('sender', 'name profileImage');

    res.status(200).json({
        success: true,
        results: messages.length,
        data: { messages }
    });
});

exports.sendMessage = catchAsync(async (req, res, next) => {
    const { conversationId } = req.params;
    const { text } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return next(new AppError('Conversation not found', 404));

    const isParticipant = conversation.participants.includes(req.user.id);
    if (!isParticipant) return next(new AppError('Access denied', 403));

    const message = await Message.create({
        conversation: conversationId,
        sender: req.user.id,
        text
    });

    // Update conversation
    conversation.lastMessage = text;
    conversation.lastMessageAt = Date.now();
    // Add other participants to unreadBy
    const otherParticipants = conversation.participants.filter(p => p.toString() !== req.user.id);
    conversation.unreadBy = otherParticipants;
    await conversation.save();

    // Emit socket event
    if (req.io) {
        req.io.to(conversationId).emit('message:new', {
            ...message.toObject(),
            sender: {
                _id: req.user.id,
                name: req.user.name,
                profileImage: req.user.profileImage
            }
        });
    }

    res.status(201).json({
        success: true,
        data: { message }
    });
});

// Group Chat Methods

exports.getGroupMessages = catchAsync(async (req, res, next) => {
    const { groupId } = req.params;

    // Check group membership
    const membership = await GroupMembership.findOne({ group: groupId, user: req.user.id });
    if (!membership) return next(new AppError('You must be a member to view messages', 403));

    const features = new APIFeatures(GroupMessage.find({ group: groupId }), req.query)
        .sort()
        .paginate();

    if (!req.query.sort) features.query = features.query.sort('sentAt');

    const messages = await features.query.populate('sender', 'name profileImage');

    res.status(200).json({
        success: true,
        results: messages.length,
        data: { messages }
    });
});

exports.sendGroupMessage = catchAsync(async (req, res, next) => {
    const { groupId } = req.params;
    const { text } = req.body;

    const membership = await GroupMembership.findOne({ group: groupId, user: req.user.id });
    if (!membership) return next(new AppError('You must be a member to send messages', 403));

    const message = await GroupMessage.create({
        group: groupId,
        sender: req.user.id,
        text
    });

    // Emit socket event
    if (req.io) {
        // Using group ID as room ID
        req.io.to(groupId).emit('message:new', {
            ...message.toObject(),
            sender: {
                _id: req.user.id,
                name: req.user.name,
                profileImage: req.user.profileImage
            }
        });
    }

    res.status(201).json({
        success: true,
        data: { message }
    });
});

exports.markAsRead = catchAsync(async (req, res, next) => {
    const { conversationId } = req.params;
    
    await Conversation.findByIdAndUpdate(conversationId, {
        $pull: { unreadBy: req.user.id }
    });

    res.status(200).json({ success: true, message: 'Marked as read' });
});
