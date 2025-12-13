const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true, // e.g. "FIRST_HIKE"
      uppercase: true,
    },
    description: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "", // could be an emoji or icon name
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Achievement", achievementSchema);
