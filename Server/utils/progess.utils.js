// utils/progress.utils.js
const User = require("../models/user.model");
const Trail = require("../models/trail.model");
const Achievement = require("../models/achievement.model");
const Notification = require("../models/notification.model");

/**
 * Called when a solo hike is marked as "completed"
 */
exports.updateProgressForCompletedSoloHike = async (soloHike) => {
  const user = await User.findById(soloHike.user);
  if (!user) return;

  const trail = await Trail.findById(soloHike.trail);
  if (!trail) return;

  // --- Update stats ---
  const stats = user.stats || {};

  const distance = trail.length || 0;
  const elevation = trail.elevationGain || 0;

  let hours = 0;
  if (soloHike.endDateTime && soloHike.startDateTime) {
    hours =
      (soloHike.endDateTime.getTime() -
        soloHike.startDateTime.getTime()) /
      (1000 * 60 * 60);
    if (hours < 0) hours = 0; // just in case
  }

  stats.totalHikes = (stats.totalHikes || 0) + 1;
  stats.totalDistance = (stats.totalDistance || 0) + distance;
  stats.totalElevation = (stats.totalElevation || 0) + elevation;
  stats.totalHours = (stats.totalHours || 0) + hours;

  user.stats = stats;

  user.completedTrails = user.completedTrails || [];
  user.completedTrails.push({
    trail: trail._id,
    completedAt: new Date(),
  });

  await user.save();

  // --- Check & award achievements ---
  await checkAndAwardAchievements(user);
};

/**
 * Check thresholds and award achievements if not already present
 */
async function checkAndAwardAchievements(user) {
  const stats = user.stats || {};
  const achievementCodesToAward = [];

  if (stats.totalHikes >= 1) achievementCodesToAward.push("FIRST_HIKE");
  if (stats.totalHikes >= 5) achievementCodesToAward.push("FIVE_HIKES");
  if (stats.totalHikes >= 10) achievementCodesToAward.push("TEN_HIKES");

  if (stats.totalDistance >= 50) achievementCodesToAward.push("DISTANCE_50KM");
  if (stats.totalDistance >= 100) achievementCodesToAward.push("DISTANCE_100KM");

  if (stats.totalElevation >= 1000)
    achievementCodesToAward.push("ELEVATION_1000M");

  if (!achievementCodesToAward.length) return;

  user.achievements = user.achievements || [];
  const existingIds = user.achievements.map((id) => id.toString());

  for (const code of achievementCodesToAward) {
    const achievement = await Achievement.findOne({ code });
    if (!achievement) continue;

    const already = existingIds.includes(achievement._id.toString());
    if (already) continue;

    user.achievements.push(achievement._id);

    // Also create a notification for this achievement
    await Notification.create({
      user: user._id,
      type: "ACHIEVEMENT",
      title: "🎖 New Achievement Unlocked!",
      message: `You unlocked: ${achievement.name}`,
      metadata: { achievementId: achievement._id, code: achievement.code },
    });
  }

  await user.save();
}
