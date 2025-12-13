const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Review = require('../models/review.model');

dotenv.config({ path: './.env' }); // Adjust path if needed, usually .env is in root

const DB = process.env.DATABASE || 'mongodb://localhost:27017/trailsathi';

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('DB connection successful!');
    try {
      console.log('Dropping index: trail_1_user_1 on reviews collection...');
      await Review.collection.dropIndex('trail_1_user_1');
      console.log('Index dropped successfully!');
    } catch (err) {
      if (err.code === 27) {
        console.log('Index not found (already dropped).');
      } else {
        console.error('Error dropping index:', err.message);
      }
    }
    process.exit();
  })
  .catch((err) => {
    console.error('DB Connection Error:', err);
    process.exit(1);
  });
