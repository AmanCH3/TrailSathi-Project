const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user.model');
const Trail = require('../models/trail.model');

dotenv.config({ path: '../.env' });

const checkJoinedTrails = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || "mongodb://localhost:27017/trailsathi_local");
    console.log('DB Connected');

    const users = await User.find({ 'joinedTrails.0': { $exists: true } }).populate('joinedTrails.trail');

    if (users.length === 0) {
      console.log('No users found with joined trails.');
    } else {
      console.log(`Found ${users.length} users with joined trails:`);
      users.forEach(u => {
        console.log(`User: ${u.name} (${u.email})`);
        u.joinedTrails.forEach(jt => {
            const trailName = jt.trail ? jt.trail.name : 'Unknown Trail (deleted?)';
            const trailId = jt.trail ? jt.trail._id : jt.trail;
            console.log(`  - Joined Trail: ${trailName} (ID: ${trailId}) on ${jt.scheduledDate}`);
        });
      });
    }

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

checkJoinedTrails();
