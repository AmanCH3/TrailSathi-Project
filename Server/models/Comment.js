const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: true
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Comment content is required']
  }
}, {
  timestamps: { createdAt: true, updatedAt: false } // Minimal timestamps
});

module.exports = mongoose.model('Comment', CommentSchema);
