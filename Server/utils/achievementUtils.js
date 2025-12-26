const Notification = require('./../models/notification.model');

const ACHIEVEMENTS = [
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Joined your first hiking group.',
    condition: (user) => (user.stats?.hikesJoined || 0) > 0 || (user.joinedTrails?.length || 0) > 0
  },
  {
    id: 'trail_conqueror',
    title: 'Trail Conqueror',
    description: 'Completed your first hike.',
    condition: (user) => (user.stats?.totalHikes || 0) > 0 || (user.completedTrails?.length || 0) > 0
  },
  {
    id: 'high_flyer',
    title: 'High Flyer',
    description: 'Claimed over 1000m of elevation gain.',
    condition: (user) => (user.stats?.totalElevation || 0) >= 1000
  },
  {
    id: 'marathoner',
    title: 'Marathoner',
    description: 'Hiked a total of 42km or more.',
    condition: (user) => (user.stats?.totalDistance || 0) >= 42
  },
  {
    id: 'solo_spirit',
    title: 'Solo Spirit',
    description: 'Completed a hike as a Solo Hiker.',
    condition: (user) => user.hikerType === 'Solo' && (user.stats?.totalHikes || 0) > 0
  },
  {
    id: 'legend',
    title: 'Trail Legend',
    description: 'Completed 10 hikes.',
    condition: (user) => (user.stats?.totalHikes || 0) >= 10
  }
];

exports.checkAndUnlockAchievements = async (user) => {
    let hasNewUnlock = false;
    const newUnlocks = [];

    // Ensure array exists
    if (!user.unlockedAchievements) {
        user.unlockedAchievements = [];
    }

    for (const achievement of ACHIEVEMENTS) {
        // specific check for Solo Spirit which relies on hikerType or other logic
        // For simplicity, we use the condition function passed with the user object
        
        if (achievement.condition(user)) {
            if (!user.unlockedAchievements.includes(achievement.id)) {
                user.unlockedAchievements.push(achievement.id);
                hasNewUnlock = true;
                newUnlocks.push(achievement);
            }
        }
    }

    if (hasNewUnlock) {
        // Save user changes (caller should ideally handle save, but we can do strictly achievement updates here if user doc is flexible)
        // Note: The caller (controller) usually calls save() after other updates.
        // If we modify 'user' object in place, the caller's save() will persist this.
        
        // Create Notifications
        for (const achievement of newUnlocks) {
            await Notification.create({
                recipient: user._id, 
                title: 'Achievement Unlocked!',
                message: `Congratulations! You've unlocked the "${achievement.title}" badge: ${achievement.description}`,
                type: 'badge',
                isRead: false,
                link: '/profile?tab=achievements'
            });
        }
    }
    
    return hasNewUnlock;
};
