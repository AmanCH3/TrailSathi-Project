const mongoose = require('mongoose');

const EventAttendanceSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['going', 'interested', 'cancelled'],
    default: 'going'
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Ensure unique attendance per event per user
EventAttendanceSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('EventAttendance', EventAttendanceSchema);
