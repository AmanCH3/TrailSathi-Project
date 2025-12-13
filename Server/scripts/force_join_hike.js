const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user.model');
const Trail = require('../models/trail.model');

dotenv.config({ path: '../.env' });

const forceJoin = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || "mongodb://localhost:27017/trailsathi_local");
    console.log('DB Connected');

    // 1. Get first user
    const user = await User.findOne();
    if (!user) {
        console.log('No users found!');
        return;
    }

    // 2. Get first trail
    const trail = await Trail.findOne();
    if (!trail) {
        console.log('No trails found!');
        return;
    }

    console.log(`Adding Trail "${trail.name}" to User "${user.name}" (${user.email})...`);

    // 3. Update
    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          $addToSet: { 
            joinedTrails: { 
               trail: trail._id,
               scheduledDate: new Date()
            } 
          }
        },
        { new: true }
    );

    console.log('Update Result Joined Trails:', updatedUser.joinedTrails);
    console.log('SUCCESS! Please ask user to refresh and check for badge on:', trail.name);

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

forceJoin();
