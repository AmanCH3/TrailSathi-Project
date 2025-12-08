const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./../models/user.model');
const Trail = require('./../models/trail.model');
const Review = require('./../models/review.model');
const Achievement = require('./../models/achievement.model');
const Group = require('./../models/Group');
const GroupMembership = require('./../models/GroupMembership');
const Post = require('./../models/Post');
const Event = require('./../models/Event');
const EventAttendance = require('./../models/EventAttendance');
const Conversation = require('./../models/Conversation');
const Message = require('./../models/Message');

dotenv.config({ path: './.env' });

const DB = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/trailsathi';

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
    role: 'admin',
    phone: '1234567890',
    bio: 'I love managing trails.'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
    role: 'user',
    phone: '0987654321',
    bio: 'Avid hiker and photographer.'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
    role: 'user',
    phone: '1122334455',
    bio: 'Weekend explorer.'
  }
];

const achievements = [
  {
    name: 'First Hike',
    code: 'FIRST_HIKE',
    description: 'Completed your first hike!',
    icon: '🥾'
  },
  {
    name: 'High Five',
    code: 'FIVE_HIKES',
    description: 'Completed 5 hikes.',
    icon: '🖐️'
  },
  {
    name: 'Ten Hikes',
    code: 'TEN_HIKES',
    description: 'Completed 10 hikes.',
    icon: '🔟'
  },
  {
    name: 'Marathoner',
    code: 'DISTANCE_50KM',
    description: 'Hiked a total of 50km.',
    icon: '🏃'
  },
  {
    name: 'Century Club',
    code: 'DISTANCE_100KM',
    description: 'Hiked a total of 100km.',
    icon: '💯'
  },
  {
    name: 'Sky High',
    code: 'ELEVATION_1000M',
    description: 'Gained 1000m in elevation.',
    icon: '🏔️'
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
    await Achievement.deleteMany();
    // Clear Community Data
    await Group.deleteMany();
    await GroupMembership.deleteMany();
    await Post.deleteMany();
    await Event.deleteMany();
    await EventAttendance.deleteMany();
    await Conversation.deleteMany();
    await Message.deleteMany();
    console.log('Data destroyed!');

    // 2. Create Users
    const createdUsers = await User.create(users);
    console.log('Users loaded!');

    // 3. Create Achievements
    await Achievement.create(achievements);
    console.log('Achievements loaded!');

    // 4. Create Trails
    const trailsWithUser = trails.map(trail => ({
        ...trail,
        createdBy: createdUsers[0]._id // Admin
    }));
    const createdTrails = await Trail.create(trailsWithUser);
    console.log('Trails loaded!');

    // 5. Create Reviews
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

    // 6. Create Community Data
    // Group
    const group = await Group.create({
        name: 'Kathmandu Hikers',
        description: 'Community for hiking lovers in KTM valley.',
        owner: createdUsers[0]._id, // Admin
        admins: [createdUsers[0]._id],
        memberCount: 2,
        postCount: 1,
        upcomingEventCount: 1
    });
    console.log('Group loaded!');

    // Memberships
    await GroupMembership.create([
        { group: group._id, user: createdUsers[0]._id, role: 'owner', status: 'active' },
        { group: group._id, user: createdUsers[1]._id, role: 'member', status: 'active' }
    ]);
    console.log('Memberships loaded!');

    // Posts
    await Post.create({
        group: group._id,
        author: createdUsers[1]._id,
        content: 'Anyone planning for Shivapuri this Saturday?',
        trailName: 'Shivapuri Peak'
    });
    console.log('Posts loaded!');

    // Events
    const event = await Event.create({
        group: group._id,
        host: createdUsers[0]._id,
        title: 'Nagarkot Sunrise Hike',
        description: 'Meet at 4 AM for sunrise.',
        startDateTime: new Date(Date.now() + 86400000 * 3), // 3 days later
        difficulty: 'Easy',
        meetLocation: 'Koteshwor'
    });
    console.log('Events loaded!');

    // Attendance
    await EventAttendance.create({
        event: event._id,
        user: createdUsers[1]._id,
        status: 'going'
    });
    // Update event participant count
    await Event.findByIdAndUpdate(event._id, { $inc: { participantsCount: 1 } });
    console.log('Event Attendance loaded!');

    // Messaging
    const conversation = await Conversation.create({
        participants: [createdUsers[1]._id, createdUsers[2]._id]
    });
    
    await Message.create({
        conversation: conversation._id,
        sender: createdUsers[1]._id,
        text: 'Hey Jane, want to join the Nagarkot hike?'
    });
    console.log('Messages loaded!');

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
    await Achievement.deleteMany();
    // Clear Community Data
    await Group.deleteMany();
    await GroupMembership.deleteMany();
    await Post.deleteMany();
    await Event.deleteMany();
    await EventAttendance.deleteMany();
    await Conversation.deleteMany();
    await Message.deleteMany();
    console.log('Data successfully deleted!');
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

// Connect to DB then run script
mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection successful!');
    
    if (process.argv[2] === '--import') {
      importData();
    } else if (process.argv[2] === '--delete') {
      deleteData();
    } else {
        importData();
    }
  })
  .catch(err => {
      console.error('DB Connection Error:', err);
      process.exit(1);
  });
