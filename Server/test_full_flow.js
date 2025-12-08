const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user.model');
const Group = require('./models/Group');
const GroupMembership = require('./models/GroupMembership');
const Post = require('./models/Post');
const Event = require('./models/Event');
const EventAttendance = require('./models/EventAttendance');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');
const GroupMessage = require('./models/GroupMessage');

dotenv.config();

const runTest = async () => {
    console.log('🚧 Starting Full User Flow Test...');

    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/trailsathi');
        console.log('✅ Connected to MongoDB');

        // --- 1. SETUP USERS ---
        console.log('\n--- 1. User Setup ---');
        const emailA = `alice_${Date.now()}@test.com`;
        const emailB = `bob_${Date.now()}@test.com`;

        const userA = await User.create({
            name: 'Alice Owner',
            email: emailA,
            password: 'password123',
            phone: '1111111111',
            role: 'user'
        });
        console.log(`✅ User A Created: ${userA.name}`);

        const userB = await User.create({
            name: 'Bob Hiker',
            email: emailB,
            password: 'password123',
            phone: '2222222222',
            role: 'user'
        });
        console.log(`✅ User B Created: ${userB.name}`);


        // --- 2. GROUP CREATION & JOINING ---
        console.log('\n--- 2. Group Flow ---');
        // Alice creates group
        const group = await Group.create({
            name: 'Himalayan Explorers',
            description: 'For serious hikers.',
            owner: userA._id,
            admins: [userA._id],
            memberCount: 1
        });
        await GroupMembership.create({ group: group._id, user: userA._id, role: 'owner' });
        console.log(`✅ Alice created group: ${group.name}`);

        // Bob joins group
        await GroupMembership.create({
            group: group._id,
            user: userB._id,
            role: 'member'
        });
        // Update count manually (simulating controller logic)
        await Group.findByIdAndUpdate(group._id, { $inc: { memberCount: 1 } });
        console.log(`✅ Bob joined group`);

        // Verify members
        const members = await GroupMembership.find({ group: group._id });
        console.log(`   Group has ${members.length} members.`);


        // --- 3. EVENT (HIKE) FLOW ---
        console.log('\n--- 3. Hike Flow ---');
        // Alice creates hike
        const event = await Event.create({
            group: group._id,
            host: userA._id,
            title: 'Langtang Trek',
            startDateTime: new Date(Date.now() + 86400000 * 7), // 1 week later
            difficulty: 'Hard'
        });
        await Group.findByIdAndUpdate(group._id, { $inc: { upcomingEventCount: 1 } });
        console.log(`✅ Alice scheduled hike: ${event.title}`);

        // Bob RSVPs (Joining Hike)
        await EventAttendance.create({
            event: event._id,
            user: userB._id,
            status: 'going'
        });
        await Event.findByIdAndUpdate(event._id, { $inc: { participantsCount: 1 } });
        console.log(`✅ Bob RSVP'd to hike`);

        // Check attendees
        const attendees = await EventAttendance.find({ event: event._id });
        console.log(`   Hike has ${attendees.length} attendees.`);


        // --- 4. MESSAGING FLOW ---
        console.log('\n--- 4. Messaging Flow ---');
        
        // DM: Bob asks Alice details
        const conversation = await Conversation.create({
            participants: [userA._id, userB._id]
        });
        
        const dm = await Message.create({
            conversation: conversation._id,
            sender: userB._id,
            text: 'Hi Alice, what gear do I need for Langtang?'
        });
        console.log(`✅ Bob sent DM: "${dm.text}"`);

        // Group Chat: Alice announces to everyone
        const groupMsg = await GroupMessage.create({
            group: group._id,
            sender: userA._id,
            text: 'Welcome everyone to the new group!'
        });
        console.log(`✅ Alice sent Group Msg: "${groupMsg.text}"`);


        console.log('\n🎉 FLOW TEST PASSED SUCCESSFULLY 🎉');

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error);
    } finally {
        // Cleanup? Optional. Leaving data for inspection.
        await mongoose.disconnect();
        process.exit();
    }
};

runTest();
