const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Notification must have a recipient']
    },
    title: {
      type: String,
      required: [true, 'Notification must have a title']
    },
    message: {
      type: String,
      required: [true, 'Notification must have a message']
    },
    type: {
        type: String,
        enum: ['system', 'badge', 'event', 'trail'],
        default: 'system'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    link: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
