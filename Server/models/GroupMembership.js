const mongoose = require('mongoose');

const GroupMembershipSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.ObjectId,
    ref: 'Group',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['owner', 'admin', 'member'],
    default: 'member'
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'banned'],
    default: 'active'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // This will add createdAt (same as joinedAt effectively) and updatedAt
});

// Ensure unique membership per group
GroupMembershipSchema.index({ group: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('GroupMembership', GroupMembershipSchema);
