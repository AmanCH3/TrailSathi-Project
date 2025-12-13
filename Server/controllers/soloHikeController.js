const SoloHike = require('./../models/soloHike.model');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { updateProgressForCompletedSoloHike } = require("../utils/progess.utils");


exports.createSoloHike = catchAsync(async (req, res, next) => {
  const { trailId, startDateTime, endDateTime, notes } = req.body;

  if (!trailId) {
    return next(new AppError('Please provide a trail ID.', 400));
  }
  if (!startDateTime) {
    return next(new AppError('Please provide a start date and time.', 400));
  }

  const newSoloHike = await SoloHike.create({
    user: req.user.id,
    trail: trailId,          
    startDateTime,
    endDateTime,
    notes
  });

  res.status(201).json({
    status: 'success',
    message: 'Solo hike scheduled successfully',
    data: {
      soloHike: newSoloHike
    }
  });
});


//  This is gonna show in the profile dashboard of the users
exports.getMySoloHikes = catchAsync(async (req, res, next) => {
  const filter = { user: req.user.id };
  if (req.query.status) {
    filter.status = req.query.status;
  }

  const soloHikes = await SoloHike.find(filter)
    .populate({
      path: 'trail',
      select: 'name location difficulty length images'
    })
    .sort('startDateTime')
    .lean();

  res.status(200).json({
    status: 'success',
    results: soloHikes.length,
    data: {
      data: soloHikes
    }
  });
});

exports.updateSoloHikeStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const hikeId = req.params.id;
    const { status, rating, difficultyFelt, notes, mood, weather, trailCondition } =
      req.body;

    if (!["planned", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const hike = await SoloHike.findOne({ _id: hikeId, user: userId });
    if (!hike) {
      return res.status(404).json({ message: "Solo hike not found" });
    }

    const prevStatus = hike.status;

    hike.status = status;
    if (rating !== undefined) hike.rating = rating;
    if (difficultyFelt) hike.difficultyFelt = difficultyFelt;
    if (notes !== undefined) hike.notes = notes;
    if (mood) hike.mood = mood;
    if (weather) hike.weather = weather;
    if (trailCondition) hike.trailCondition = trailCondition;

    // If marking as completed and no endDateTime, set it to now
    if (status === "completed" && !hike.endDateTime) {
      hike.endDateTime = new Date();
    }
    await hike.save();

    // If it just transitioned from planned -> completed, update progress
    if (prevStatus !== "completed" && status === "completed") {
      await updateProgressForCompletedSoloHike(hike);
    }

    return res.json({
      message: "Solo hike updated",
      data: hike,
    });
  } catch (err) {
    next(err);
  }
};