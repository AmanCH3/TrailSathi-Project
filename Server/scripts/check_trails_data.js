const mongoose = require('mongoose');
const Trail = require('../models/trail.model');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const checkData = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_LOCAL || process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('DB Connected');

    const countAll = await Trail.countDocuments();
    const countWithDuration = await Trail.countDocuments({ duration: { $exists: true } });
    const countWithoutDuration = await Trail.countDocuments({ duration: { $exists: false } });

    console.log(`Total Trails: ${countAll}`);
    console.log(`With Duration: ${countWithDuration}`);
    console.log(`Without Duration: ${countWithoutDuration}`);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkData();
