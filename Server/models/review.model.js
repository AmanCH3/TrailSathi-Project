const mongoose = require('mongoose');
const Trail = require('./trail.model');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Review must have a rating.']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    trail: {
      type: mongoose.Schema.ObjectId,
      ref: 'Trail',
      required: [true, 'Review must belong to a trail.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.']
    },
    images: [String]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Prevent duplicate reviews
reviewSchema.index({ trail: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name profileImage'
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function(trailId) {
  const stats = await this.aggregate([
    {
      $match: { trail: trailId }
    },
    {
      $group: {
        _id: '$trail',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Trail.findByIdAndUpdate(trailId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Trail.findByIdAndUpdate(trailId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save', function() {
  // this points to current review
  this.constructor.calcAverageRatings(this.trail);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.clone().findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  // await this.findOne(); does NOT work here, query has already executed
  if (this.r) {
    await this.r.constructor.calcAverageRatings(this.r.trail);
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
