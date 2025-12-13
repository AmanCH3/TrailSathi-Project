const mongoose = require('mongoose');
const slugify = require('slugify');

const trailSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A trail must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A trail name must have less or equal then 40 characters'],
      minlength: [5, 'A trail name must have more or equal then 5 characters']
    },
    slug: String,
    description: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      required: [true, 'A trail must have a location description']
    },
    difficulty: {
      type: String,
      required: [true, 'A trail must have a difficulty'],
      enum: {
        values: ['Easy', 'Moderate', 'Hard'],
        message: 'Difficulty is either: Easy, Moderate, Hard'
      },
      default: 'Moderate'
    },
    duration: {
      type: Number,
      // required: [true, 'A trail must have a duration'] // Optional for now to avoid breaking existing data
    },
    length: {
      type: Number,
      required: [true, 'A trail must have a length']
    },
    elevationGain: {
      type: Number,
      required: [true, 'A trail must have an elevation gain']
    },
    tags: [String],
    images: [String],
    galleryImages: [
      {
        url: String,
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User'
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 // 4.666666 -> 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: {
        type: [Number],
        required: [true, 'A trail must have coordinates [long, lat]']
      },
      address: String,
      description: String
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published'
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
trailSchema.index({ startLocation: '2dsphere' });
trailSchema.index({ slug: 1 });

// Virtual populate
trailSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'trail',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
trailSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Trail = mongoose.model('Trail', trailSchema);

module.exports = Trail;
