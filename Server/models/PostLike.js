const mongoose = require('mongoose');

const PostLikeSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false } // Only createdAt is needed usually, but requirements said createdAt
});

// Ensure unique like per post per user
PostLikeSchema.index({ post: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('PostLike', PostLikeSchema);
