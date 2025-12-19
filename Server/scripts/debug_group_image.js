const mongoose = require('mongoose');
const Group = require('../models/Group');
const path = require('path');
const dotenv = require('dotenv');
// Try explicit path resolution
const envPath = path.resolve(__dirname, '..', '.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

const checkGroup = async () => {
  await connectDB();
  try {
    const group = await Group.findOne({ name: 'Photography Club' });
    if (group) {
        console.log('Group Found:');
        console.log('Nam:', group.name);
        console.log('CoverImage:', group.coverImage);
        console.log('Avatar:', group.avatar);
    } else {
        console.log('Group not found');
    }
  } catch (error) {
    console.error('Error fetching group:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkGroup();
