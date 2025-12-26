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
  },
  type: {
    type: String,
    enum: ['direct', 'group', 'event'],
    default: 'direct'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Conversation', ConversationSchema);
