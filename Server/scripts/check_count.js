const mongoose = require('mongoose');
const Trail = require('../models/trail.model');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const checkCount = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_LOCAL || process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('DB Connected');
    
    // Debug: Print connection string (masked)
    console.log('Conn:', (process.env.DATABASE_LOCAL || process.env.DATABASE).substring(0, 15) + '...');

    const count = await Trail.countDocuments();
    console.log(`Total Trails in DB: ${count}`);
    
    if (count > 0) {
        const sample = await Trail.findOne();
        console.log('Sample Trail:', JSON.stringify(sample, null, 2));
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkCount();
