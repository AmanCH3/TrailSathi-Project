const mongoose = require('mongoose');
const dotenv = require('dotenv');
const SoloHike = require('../models/soloHike.model');
const User = require('../models/user.model');

dotenv.config({ path: './.env' });

const checkSoloHikes = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || "mongodb://localhost:27017/trailsathi_local");
    console.log('DB Connected');

    const soloHikes = await SoloHike.find({}).populate('user').populate('trail');
    
    if (soloHikes.length === 0) {
        console.log("No SoloHikes found in DB.");
    } else {
        console.log(`Found ${soloHikes.length} SoloHikes:`);
        soloHikes.forEach(sh => {
            console.log(`- User: ${sh.user ? sh.user.name : 'Unknown'} (${sh.user?._id})`);
            console.log(`  Trail: ${sh.trail ? sh.trail.name : 'Unknown'} (${sh.trail?._id})`);
            console.log(`  Status: ${sh.status}`);
            console.log(`  Date: ${sh.startDateTime}`);
        });
    }

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

checkSoloHikes();
