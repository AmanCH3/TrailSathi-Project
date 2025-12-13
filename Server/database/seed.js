const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Trail = require('../models/trail.model');
const User = require('../models/user.model');

// Load env vars
dotenv.config();

const DB = process.env.DATABASE_URI || 'mongodb://localhost:27017/trailsathi';

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful for seeding!'));

const trails = [
  {
    name: 'Shivapuri Peak Trek',
    location: 'Shivapuri Nagarjun National Park',
    description: 'A moderate hike offering panoramic views of the Kathmandu Valley and the Himalayas. The trail passes through dense forests and a Buddhist nunnery.',
    difficulty: 'Moderate',
    length: 12, // km
    elevationGain: 800, // meters
    images: [
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596328637777-62f43d8393fa?q=80&w=1000'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [85.3906, 27.7963], // lng, lat
      description: 'Budhanilkantha Temple Entrance'
    },
    ratingsAverage: 4.5,
    ratingsQuantity: 12
  },
  {
    name: 'Champadevi Hill Hike',
    location: 'Kirtipur, Kathmandu',
    description: 'A popular hiking destination in the south of Kathmandu valley. It is the third highest hill around Kathmandu valley.',
    difficulty: 'Moderate',
    length: 10,
    elevationGain: 700,
    images: [
      'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1000'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [85.255, 27.633],
      description: 'Hattiban Resort Gate'
    },
    ratingsAverage: 4.2,
    ratingsQuantity: 8
  },
  {
    name: 'Nagarkot Panoramic Trail',
    location: 'Nagarkot, Bhaktapur',
    description: 'Famous for its sunrise views of the Himalayas including Mount Everest. An easy walk through pine forests and villages.',
    difficulty: 'Easy',
    length: 8,
    elevationGain: 300,
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?q=80&w=1000'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [85.52, 27.71],
      description: 'Nagarkot Bus Stop'
    },
    ratingsAverage: 4.7,
    ratingsQuantity: 25
  },
  {
    name: 'Sundarijal to Chisapani',
    location: 'Shivapuri National Park',
    description: 'A classic hike entering the Shivapuri National Park, passing by waterfalls and reservoirs, leading to the Chisapani village.',
    difficulty: 'Hard',
    length: 16,
    elevationGain: 1100,
    images: [
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=1000'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [85.42, 27.76],
      description: 'Sundarijal Water Works'
    },
    ratingsAverage: 4.6,
    ratingsQuantity: 18
  },
  {
    name: 'Phulchowki Hill Trek',
    location: 'Godawari, Lalitpur',
    description: 'The highest hill surrounding Kathmandu valley. Known for vegetation, bird watching, and snowfall in winter.',
    difficulty: 'Hard',
    length: 18,
    elevationGain: 1560,
    images: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1000'
    ],
    startLocation: {
      type: 'Point',
      coordinates: [85.38, 27.59],
      description: 'Godawari Botanical Garden'
    },
    ratingsAverage: 4.4,
    ratingsQuantity: 10
  }
];

const Review = require('../models/review.model');

const seedDB = async () => {
  try {
    // 1) Clear DB
    await Trail.deleteMany();
    await Review.deleteMany();
    console.log('Trails and Reviews deleted');

    // 2) Get User (Admin)
    const admin = await User.findOne({ role: 'admin' });
    let userId = admin ? admin._id : null;

    if (!userId) {
        console.log("No admin user found. Please run this script after creating a user, or let me create a dummy user.");
        // Optional: Create a dummy user if none exists
    }

    // 3) Create Trails
    const trailsWithUser = trails.map(trail => ({
      ...trail,
      createdBy: userId,
      status: 'published'
    }));

    const createdTrails = await Trail.create(trailsWithUser);
    console.log(`${createdTrails.length} trails created!`);

    // 4) Create Reviews for each trail
    const reviews = [];
    const dummyReviews = [
        {
            review: "Prep for Annapurna Circuit. Day hike through the jungle from Kathmandu to Nagi Gumba. Stopped inside for lunch. Absolutely stunning views upon emerging from the jungle. Wonderful flora and fauna.",
            rating: 5,
            images: ["https://images.unsplash.com/photo-1551632811-561732d1e306?w=200&fit=crop"]
        },
        {
            review: "Good conditions not too many signs, but generally a single pathway most of the time. Great temperature. Conditions: Trash on trail.",
            rating: 4,
            images: []
        },
        {
            review: "Entry 1000rs. No need for guide. First day can be tough, use hiking poles to make it enjoyable. Paths are easy enough that kids go up to the top.",
            rating: 5,
            images: []
        },
        {
            review: "Lots of monkey so happy. Easy walk for beginners.",
            rating: 4,
            images: []
        }
    ];

    for (const trail of createdTrails) {
        // Add 2-3 reviews per trail
        for (let i = 0; i < 3; i++) {
            const randomReview = dummyReviews[Math.floor(Math.random() * dummyReviews.length)];
            reviews.push({
                review: randomReview.review,
                rating: randomReview.rating,
                trail: trail._id,
                user: userId, // assigning all to admin for simplicity, or fetch random users
                images: randomReview.images
            });
        }
    }

    if (reviews.length > 0 && userId) {
        await Review.create(reviews);
        console.log(`${reviews.length} reviews created!`);
    }

  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
};

seedDB();
