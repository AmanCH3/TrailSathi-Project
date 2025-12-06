const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./../models/user.model');
const Trail = require('./../models/trail.model');
const Review = require('./../models/review.model');

dotenv.config({ path: './.env' });

const DB = process.env.MONGODB_URI;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
    role: 'admin',
    phone: '1234567890'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
    role: 'user',
    phone: '0987654321'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
    role: 'user',
    phone: '1122334455'
  }
];

const trails = [
  {
    name: 'Shivapuri Peak Trail',
    description: 'A challenging hike to the peak of Shivapuri with panoramic views of the Himalayas.',
    location: 'Shivapuri Nagarjun National Park, Kathmandu',
    difficulty: 'Hard',
    length: 12,
    elevationGain: 800,
    startLocation: {
      type: 'Point',
      coordinates: [85.3906, 27.8015], // [lng, lat]
      description: 'Shivapuri National Park Entrance'
    },
    images: ['trail-1.jpg', 'trail-2.jpg']
  },
  {
    name: 'Nagarkot Panoramic Hike',
    description: 'An easy and scenic hike offering stunning sunrise and sunset views.',
    location: 'Nagarkot, Bhaktapur',
    difficulty: 'Easy',
    length: 5,
    elevationGain: 200,
    startLocation: {
      type: 'Point',
      coordinates: [85.5214, 27.7174],
      description: 'Nagarkot Bus Stop'
    },
    images: ['trail-3.jpg']
  },
  {
    name: 'Champadevi Trail',
    description: 'A moderate hike through pine forests to the Champadevi temple.',
    location: 'Pharping, Kathmandu',
    difficulty: 'Moderate',
    length: 8,
    elevationGain: 600,
    startLocation: {
      type: 'Point',
      coordinates: [85.2639, 27.6253],
      description: 'Hattiban Resort'
    },
    images: ['trail-4.jpg']
  }
];

const importData = async () => {
  try {
    // 1. Clear existing data
    await Review.deleteMany();
    await Trail.deleteMany();
    await User.deleteMany();
    console.log('Data destroyed!');

    // 2. Create Users
    const createdUsers = await User.create(users);
    console.log('Users loaded!');

    // 3. Create Trails (assigning a random admin as createdBy if needed, or just leaving it null for now)
    const trailsWithUser = trails.map(trail => ({
        ...trail,
        createdBy: createdUsers[0]._id // Admin
    }));
    const createdTrails = await Trail.create(trailsWithUser);
    console.log('Trails loaded!');

    // 4. Create Reviews
    const reviews = [
      {
        review: 'Absolutely stunning views! The climb was tough but worth it.',
        rating: 5,
        trail: createdTrails[0]._id,
        user: createdUsers[1]._id
      },
      {
        review: 'Nice walk, very relaxing.',
        rating: 4,
        trail: createdTrails[1]._id,
        user: createdUsers[2]._id
      },
      {
        review: 'A bit crowded on weekends, but good exercise.',
        rating: 4,
        trail: createdTrails[2]._id,
        user: createdUsers[1]._id
      }
    ];
    await Review.create(reviews);
    console.log('Reviews loaded!');

    console.log('Data successfully loaded!');
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Review.deleteMany();
    await Trail.deleteMany();
    await User.deleteMany();
    console.log('Data successfully deleted!');
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
    // Default to import if no arg
    importData();
}
