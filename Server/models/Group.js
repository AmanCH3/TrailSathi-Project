const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true,
    maxlength: [100, 'Group name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  location: {
    type: String
  },
  privacy: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  coverImage: {
    type: String,
    default: 'default_group_cover.jpg' 
  },
  tags: [String],
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  admins: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  memberCount: {
    type: Number,
    default: 0
  },
  postCount: {
    type: Number,
    default: 0
  },
  upcomingEventCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better search performance
GroupSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Group', GroupSchema);
