const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user.model');
const bcrypt = require('bcryptjs');

dotenv.config();

const DB = process.env.DATABASE_URI || 'mongodb://localhost:27017/trailsathi';

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('DB connection successful!');
    
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
        console.log('Found admin:', admin.email);
        admin.password = 'password123';
        admin.passwordConfirm = 'password123';
        
        // We need to save. The pre-save hook will hash the password.
        await admin.save({ validateBeforeSave: false }); 
        console.log('Password updated to: password123');
    } else {
        console.log('No admin user found to update.');
    }
    process.exit();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
