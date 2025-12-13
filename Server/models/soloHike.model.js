// models/soloHike.model.js
const mongoose = require("mongoose");

const soloHikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    trail: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trail",
      required: true,
      index: true,
    },
    startDateTime: {
      type: Date,
      required: true,
    },
    endDateTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["planned", "completed", "cancelled"],
      default: "planned",
      index: true,
    },

    // Hike diary fields
    notes: { type: String },
    mood: {
      type: String,
      enum: ["Fresh", "Tired", "Challenging", "Amazing", "Okay"],
    },
    weather: {
      type: String,
      enum: ["Sunny", "Cloudy", "Rainy", "Foggy", "Windy", "Mixed"],
    },
    trailCondition: {
      type: String,
      enum: ["Dry", "Muddy", "Slippery", "Snowy", "Rocky", "Mixed"],
    },

    difficultyFelt: {
      type: String,
      enum: ["Easy", "Moderate", "Hard"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    reminderSent: {
      type: Boolean,
      default: false,
    },
    postHikePromptSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

soloHikeSchema.index({ user: 1, startDateTime: 1 });

module.exports = mongoose.model("SoloHike", soloHikeSchema);
