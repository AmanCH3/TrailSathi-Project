const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: String
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  unreadBy: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  relatedGroup: {
    type: mongoose.Schema.ObjectId,
    ref: 'Group'
  },
  relatedEvent: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Conversation', ConversationSchema);
