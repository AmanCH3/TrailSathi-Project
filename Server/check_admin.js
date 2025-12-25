const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user.model');

dotenv.config();

const DB = process.env.DATABASE_URI || 'mongodb://localhost:27017/trailsathi';

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('DB connection successful!');
    
    const admin = await User.findOne({ role: 'admin' }).select('+password');
    if (admin) {
        console.log('Admin user found:', {
            name: admin.name,
            email: admin.email,
            role: admin.role,
            id: admin._id
        });
    } else {
        console.log('No admin user found!');
        
        // Create one for testing
        try {
            const newAdmin = await User.create({
                name: 'Admin User',
                email: 'admin@trailsathi.com',
                password: 'password123',
                passwordConfirm: 'password123', // Just in case validator requires it, though schema doesn't show it
                role: 'admin',
                phone: '9800000000'
            });
            console.log('Created new admin user:', newAdmin.email);
        } catch(err) {
            console.error('Error creating admin:', err.message);
        }
    }
    process.exit();
  })
  .catch(err => {
    console.error('DB Connection Error:', err);
    process.exit(1);
  });
