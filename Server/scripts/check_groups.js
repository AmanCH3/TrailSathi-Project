const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });
const Group = require('../models/Group');

const checkGroups = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || process.env.MONGODB_URI);
    console.log('Connected to DB');
    const groups = await Group.find({});
    console.log(`Found ${groups.length} groups.`);
    groups.forEach(g => console.log(`- ${g.name} (${g.privacy})`));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkGroups();
