const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import Models (using correct casing from what I saw in list_dir)
const User = require('../models/user.model');
const Group = require('../models/Group');
const GroupMembership = require('../models/GroupMembership');
const Event = require('../models/Event');
const EventAttendance = require('../models/EventAttendance');
const Post = require('../models/Post');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Notification = require('../models/notification.model'); // Updated import

const seedCommunity = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.DATABASE_URL || process.env.MONGODB_URI, {});
    console.log('✅ Connected to MongoDB');

    // 1. Cleanup
    console.log('🧹 Cleaning up community collections...');
    await Promise.all([
      Group.deleteMany({}),
      GroupMembership.deleteMany({}),
      Event.deleteMany({}),
      EventAttendance.deleteMany({}),
      Post.deleteMany({}),
      Conversation.deleteMany({}),
      Message.deleteMany({}),
      Notification.deleteMany({})
    ]);

    // 2. Get Users or Create Dummies
    let users = await User.find().limit(10);
    console.log(`Found ${users.length} existing users.`);

    if (users.length < 5) {
      console.error('❌ Not enough users found (need at least 5). Please register some users first.');
      process.exit(1);
    }

    const mainUser = users[0]; // You
    const otherUsers = users.slice(1);

    // 3. Create Groups
    console.log('Creating Groups...');
    const groupData = [
      {
        name: 'Weekend Hikers',
        description: 'A community for those who love to hit the trails on weekends. All skill levels welcome!',
        location: 'Kathmandu, Nepal',
        privacy: 'public',
        tags: ['hiking', 'weekend', 'social'],
        owner: mainUser._id,
        coverImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop',
        avatar: 'https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=2028&auto=format&fit=crop'
      },
      {
        name: 'Photography Club',
        description: 'Capture the beauty of nature. We organize photo walks and nature photography workshops.',
        location: 'Pokhara, Nepal',
        privacy: 'public',
        tags: ['photography', 'nature', 'art'],
        owner: otherUsers[0]._id,
        coverImage: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2008&auto=format&fit=crop',
        avatar: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Trail Runners',
        description: 'For those who prefer speed. Weekly trail running sessions and training tips.',
        location: 'Lalitpur, Nepal',
        privacy: 'public',
        tags: ['running', 'fitness', 'training'],
        owner: otherUsers[1]._id,
        coverImage: 'https://images.unsplash.com/photo-1552674605-4696c0465d2d?q=80&w=2070&auto=format&fit=crop',
        avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop'
      },
      {
        name: 'Secret Summits',
        description: 'Exclusive group for experienced mountaineers planning high-altitude expeditions.',
        location: 'Remote',
        privacy: 'private',
        tags: ['mounting', 'expedition', 'extreme'],
        owner: otherUsers[2]._id,
        coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
        avatar: 'https://images.unsplash.com/photo-1522666257812-173fdc2d11fe?q=80&w=2070&auto=format&fit=crop'
      }
    ];

    const createdGroups = await Group.create(groupData);
    console.log(`✅ Created ${createdGroups.length} groups.`);

    // 4. Create Memberships (Active & Pending)
    console.log('Assigning Memberships & Pending Requests...');
    const memberships = [];
    
    for (const group of createdGroups) {
      // Owner membership
      memberships.push({
        group: group._id,
        user: group.owner,
        role: 'owner',
        status: 'active'
      });

      // Add other random users as members
      for (const user of otherUsers) {
        if (user._id.toString() !== group.owner.toString()) {
           const rand = Math.random();
           if (rand > 0.6) {
             // Active Member
             memberships.push({
               group: group._id,
               user: user._id,
               role: 'member',
               status: 'active'
             });
           } else if (rand > 0.4) {
             // Pending Request (User requested to join)
             // Only for mainUser to see as admin/owner, OR for mainUser to have pending request elsewhere
             memberships.push({
               group: group._id,
               user: user._id,
               role: 'member',
               status: 'pending' 
             });
           }
        }
      }
      
      // Ensure mainUser is member of "Photography Club"
      if (group.name === 'Photography Club') {
         if (!memberships.find(m => m.user.toString() === mainUser._id.toString() && m.group.toString() === group._id.toString())) {
            memberships.push({
              group: group._id,
              user: mainUser._id,
              role: 'member',
              status: 'active'
            });
         }
      }
    }
    
    await GroupMembership.create(memberships);
    
    // Update member counts
    for (const group of createdGroups) {
        const count = memberships.filter(m => m.group.toString() === group._id.toString() && m.status === 'active').length;
        await Group.findByIdAndUpdate(group._id, { memberCount: count });
    }

    // 5. Create Events
    console.log('Creating Events...');
    const events = [];
    const now = new Date();

    for (const group of createdGroups) {
      // Upcoming Event (Tomorrow)
      events.push({
        group: group._id,
        title: `${group.name} Sunrise Hike`,
        description: 'Early morning hike to catch the sunrise. Bring coffee!',
        startDateTime: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // + 1 day
        difficulty: 'Moderate',
        meetLocation: 'Base Camp A',
        status: 'Upcoming',
        host: group.owner
      });

      // Upcoming Event (Next Week)
      events.push({
        group: group._id,
        title: `${group.name} Monthly Meetup`,
        description: 'Join us for our regular monthly gathering.',
        startDateTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // + 7 days
        difficulty: 'Easy',
        meetLocation: 'City Park Gate',
        status: 'Upcoming',
        host: group.owner
      });

       // Past Event
       events.push({
        group: group._id,
        title: 'Past Adventure',
        description: 'It was fun!',
        startDateTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // - 7 days
        difficulty: 'Hard',
        meetLocation: 'Mountain Peak',
        status: 'Completed',
        host: group.owner
      });
    }

    const createdEvents = await Event.create(events);
    console.log(`✅ Created ${createdEvents.length} events.`);

    // 6. Create Event Attendance
    const attendances = [];
    for (const event of createdEvents) {
        if (event.status === 'Upcoming') {
            // Main user going
            attendances.push({
                event: event._id,
                user: mainUser._id,
                status: 'going'
            });
            // Update RSVP count
             await Event.findByIdAndUpdate(event._id, { participantsCount: 1 });
        }
    }
    await EventAttendance.create(attendances);

    // 7. Create Posts
    console.log('Creating Posts...');
    const posts = [];
    const sampleImages = [
       'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&auto=format&fit=crop',
       'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&auto=format&fit=crop'
    ];

    for (const group of createdGroups) {
      posts.push({
        group: group._id,
        author: group.owner,
        content: `Welcome to ${group.name}!`,
        likesCount: Math.floor(Math.random() * 20),
        commentsCount: Math.floor(Math.random() * 5)
      });
    }
    await Post.create(posts);
    
    // Update post counts
    for (const group of createdGroups) {
        const count = posts.filter(p => p.group.toString() === group._id.toString()).length;
        await Group.findByIdAndUpdate(group._id, { postCount: count });
    }

    // 8. Create Conversations & Messages
    console.log('Creating Conversations & Messages...');
    // Create 3 active conversations for mainUser
    for (let i = 0; i < 3 && i < otherUsers.length; i++) {
        const partner = otherUsers[i];
        
        const conversation = await Conversation.create({
            participants: [mainUser._id, partner._id],
            lastMessage: i === 0 ? 'Are you sure about the time?' : 'See you there!',
            lastMessageAt: new Date(),
            unreadCount: i === 0 ? 2 : 0 // First one has unread
        });
        
        // Add some messages
        await Message.create({
            conversation: conversation._id,
            sender: partner._id,
            text: 'Hey, checked the location?',
            sentAt: new Date(Date.now() - 1000 * 60 * 60)
        });

        if (i === 0) {
             // Unread messages for the first conversation
             await Message.create({
                conversation: conversation._id,
                sender: partner._id,
                text: 'Are you sure about the time?',
                sentAt: new Date()
            });
        } else {
             await Message.create({
                conversation: conversation._id,
                sender: mainUser._id,
                text: 'Yes, absolutely.',
                sentAt: new Date()
            });
        }
    }
    console.log('✅ Created Conversations.');


    // 9. Create Notifications
    console.log('Creating Notifications...');
    const dummyNotifications = [
        {
            user: mainUser._id,
            type: 'REMINDER',
            title: 'Upcoming Hike Reminder',
            message: 'Your hike "Weekend Hikers Sunrise Hike" is tomorrow at 6:00 AM.',
            read: false
        },
        {
            user: mainUser._id,
            type: 'INFO',
            title: 'New Member Joined',
            message: 'Alice just joined "Photography Club". Say hello!',
            read: true
        },
        {
            user: mainUser._id,
            type: 'ACHIEVEMENT',
            title: 'Badge Earned: Early Bird',
            message: 'You joined your first morning hike event!',
            read: false
        }
    ];
    await Notification.create(dummyNotifications);
    console.log('✅ Created Notifications.');

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedCommunity();
