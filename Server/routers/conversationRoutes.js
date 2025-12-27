const express = require('express');
const conversationController = require('../controllers/conversationController');
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect); // All routes protected

router.route('/')
    .get(conversationController.getConversations)
    .post(conversationController.createConversation);

router.get('/:conversationId', conversationController.getConversation);

router.route('/:conversationId/messages')
    .get(messageController.getMessages)
    .post(messageController.sendMessage);

router.delete('/:conversationId', conversationController.deleteConversation);
router.delete('/:conversationId/messages/:messageId', messageController.deleteMessage);

router.put('/:conversationId/read', messageController.markAsRead);

module.exports = router;
