const Conversation = require('../models/Conversation');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getConversations = catchAsync(async (req, res, next) => {
    const conversations = await Conversation.find({
        participants: req.user.id
    })
    .populate('participants', 'name profileImage') // to show who you are talking to
    .sort('-lastMessageAt');

    res.status(200).json({
        success: true,
        results: conversations.length,
        data: { conversations }
    });
});

exports.createConversation = catchAsync(async (req, res, next) => {
    const { recipientId } = req.body;

    // Check if conversation already exists between these two users
    // This logic assumes 1-on-1 for simplicity as per standard DMs
    // If we support group DMs, logic is different. "Participant list exact match".
    // For now, assuming direct message:
    
    // Find conversation where participants contains both IDs and size 2
    let conversation = await Conversation.findOne({
        participants: { $all: [req.user.id, recipientId], $size: 2 },
        relatedGroup: null // Ensure it's not a group context if we reuse model? 
                           // Actually Group Chat uses GroupMessage model, unrelated to Conversation usually. 
                           // But User request implies unified "Conversation" for DMs.
    });

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [req.user.id, recipientId],
            unreadBy: [recipientId] // Initial state? Or empty until first msg?
        });
    }

    res.status(200).json({
        success: true,
        data: { conversation }
    });
});

exports.getConversation = catchAsync(async (req, res, next) => {
    const conversation = await Conversation.findById(req.params.conversationId)
        .populate('participants', 'name profileImage');
        
    if (!conversation) return next(new AppError('Conversation not found', 404));

    // Security check: user must be participant
    const isParticipant = conversation.participants.some(p => p._id.toString() === req.user.id);
    if (!isParticipant) return next(new AppError('Access denied', 403));

    res.status(200).json({
        success: true,
        data: { conversation }
    });
});
