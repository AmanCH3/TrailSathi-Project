const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.ObjectId,
    ref: 'Group',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String
  },
  trailName: {
    type: String
  },
  startDateTime: {
    type: Date,
    required: [true, 'Event start date and time is required']
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Hard'],
    default: 'Moderate'
  },
  meetLocation: {
    type: String
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  host: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  participantsCount: {
    type: Number,
    default: 0
  },
  maxParticipants: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', EventSchema);
