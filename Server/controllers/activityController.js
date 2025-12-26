const User = require('../models/user.model');
const Group = require('../models/Group.js');
const SoloHike = require('../models/soloHike.model');
const Review = require('../models/review.model');
const Post = require('../models/Post.js');
const Event = require('../models/Event.js');
const Payment = require('../models/payment.model');
const catchAsync = require('../utils/catchAsync');

exports.getRecentActivity = catchAsync(async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20;
    const allActivity = [];

    // 1. Recent Users Joined
    const newUsers = await User.find()
        .sort({ joinDate: -1 })
        .limit(limit)
        .select('name profileImage joinDate');

    allActivity.push(...newUsers.map(user => ({
        id: `user_${user._id}`,
        type: 'user_joined',
        user: user.name,
        avatar: user.profileImage ? process.env.API_URL + '/' + user.profileImage : null,
        time: user.joinDate,
        description: 'joined the community'
    })));

    // 2. Recent Groups Created
    const newGroups = await Group.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('owner', 'name profileImage')
        .select('name createdAt owner');

    allActivity.push(...newGroups.map(group => ({
        id: `group_${group._id}`,
        type: 'group_created',
        user: group.owner ? group.owner.name : 'Unknown User',
        avatar: group.owner && group.owner.profileImage ? process.env.API_URL + '/' + group.owner.profileImage : null,
        time: group.createdAt,
        trail: group.name,
        description: 'created a new group'
    })));

    // 3. Recent Hikes Planned
    const plannedHikes = await SoloHike.find({ status: 'planned' })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('user', 'name profileImage')
        .populate('trail', 'name');

    allActivity.push(...plannedHikes.map(hike => ({
        id: `hike_planned_${hike._id}`,
        type: 'hike_planned',
        user: hike.user ? hike.user.name : 'Unknown User',
        avatar: hike.user && hike.user.profileImage ? process.env.API_URL + '/' + hike.user.profileImage : null,
        time: hike.createdAt,
        trail: hike.trail ? hike.trail.name : 'Unknown Trail',
        description: 'planned a hike'
    })));

    // 4. Recent Hikes Completed
    const completedHikes = await SoloHike.find({ status: 'completed' })
        .sort({ endDateTime: -1 })
        .limit(limit)
        .populate('user', 'name profileImage')
        .populate('trail', 'name');

    allActivity.push(...completedHikes.map(hike => ({
        id: `hike_completed_${hike._id}`,
        type: 'hike_completed',
        user: hike.user ? hike.user.name : 'Unknown User',
        avatar: hike.user && hike.user.profileImage ? process.env.API_URL + '/' + hike.user.profileImage : null,
        time: hike.endDateTime || hike.updatedAt,
        trail: hike.trail ? hike.trail.name : 'Unknown Trail',
        description: 'completed a hike'
    })));

    // 5. Recent Reviews Posted
    const reviews = await Review.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('user', 'name profileImage')
        .populate('trail', 'name');

    allActivity.push(...reviews.map(review => ({
        id: `review_${review._id}`,
        type: 'review_posted',
        user: review.user ? review.user.name : 'Unknown User',
        avatar: review.user && review.user.profileImage ? process.env.API_URL + '/' + review.user.profileImage : null,
        time: review.createdAt,
        trail: review.trail ? review.trail.name : 'Unknown Trail',
        description: 'posted a review'
    })));

    // 6. Recent Posts Created
    const posts = await Post.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('author', 'name profileImage')
        .populate('group', 'name');

    allActivity.push(...posts.map(post => ({
        id: `post_${post._id}`,
        type: 'post_created',
        user: post.author ? post.author.name : 'Unknown User',
        avatar: post.author && post.author.profileImage ? process.env.API_URL + '/' + post.author.profileImage : null,
        time: post.createdAt,
        trail: post.group ? post.group.name : null,
        description: 'created a post'
    })));

    // 7. Recent Events Created
    const events = await Event.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('host', 'name profileImage')
        .populate('group', 'name');

    allActivity.push(...events.map(event => ({
        id: `event_${event._id}`,
        type: 'event_created',
        user: event.host ? event.host.name : 'Unknown User',
        avatar: event.host && event.host.profileImage ? process.env.API_URL + '/' + event.host.profileImage : null,
        time: event.createdAt,
        trail: event.group ? event.group.name : event.title,
        description: 'created an event'
    })));

    // 8. Recent Payments Made
    const payments = await Payment.find({ status: 'success' })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('userId', 'name profileImage');

    allActivity.push(...payments.map(payment => ({
        id: `payment_${payment._id}`,
        type: 'payment_made',
        user: payment.userId ? payment.userId.name : 'Unknown User',
        avatar: payment.userId && payment.userId.profileImage ? process.env.API_URL + '/' + payment.userId.profileImage : null,
        time: payment.createdAt,
        trail: `$${payment.amount}`,
        description: 'made a payment'
    })));

    // Sort all activities by time (most recent first)
    allActivity.sort((a, b) => new Date(b.time) - new Date(a.time));

    // Return top activities
    res.status(200).json({
        success: true,
        count: allActivity.length,
        data: allActivity.slice(0, limit)
    });
});

// Get activities by specific user ID (Admin only)
exports.getUserActivity = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const allActivity = [];

    // 1. User Join Activity
    const user = await User.findById(userId).select('name profileImage joinDate');
    if (user) {
        allActivity.push({
            id: `user_${user._id}`,
            type: 'user_joined',
            user: user.name,
            avatar: user.profileImage ? process.env.API_URL + '/' + user.profileImage : null,
            time: user.joinDate,
            description: 'joined the community'
        });
    }

    // 2. Groups Created
    const groups = await Group.find({ owner: userId })
        .sort({ createdAt: -1 })
        .populate('owner', 'name profileImage')
        .select('name createdAt owner');

    allActivity.push(...groups.map(group => ({
        id: `group_${group._id}`,
        type: 'group_created',
        user: group.owner ? group.owner.name : 'Unknown User',
        avatar: group.owner && group.owner.profileImage ? process.env.API_URL + '/' + group.owner.profileImage : null,
        time: group.createdAt,
        trail: group.name,
        description: 'created a new group'
    })));

    // 3. Hikes Planned
    const plannedHikes = await SoloHike.find({ user: userId, status: 'planned' })
        .sort({ createdAt: -1 })
        .populate('user', 'name profileImage')
        .populate('trail', 'name');

    allActivity.push(...plannedHikes.map(hike => ({
        id: `hike_planned_${hike._id}`,
        type: 'hike_planned',
        user: hike.user ? hike.user.name : 'Unknown User',
        avatar: hike.user && hike.user.profileImage ? process.env.API_URL + '/' + hike.user.profileImage : null,
        time: hike.createdAt,
        trail: hike.trail ? hike.trail.name : 'Unknown Trail',
        description: 'planned a hike'
    })));

    // 4. Hikes Completed
    const completedHikes = await SoloHike.find({ user: userId, status: 'completed' })
        .sort({ endDateTime: -1 })
        .populate('user', 'name profileImage')
        .populate('trail', 'name');

    allActivity.push(...completedHikes.map(hike => ({
        id: `hike_completed_${hike._id}`,
        type: 'hike_completed',
        user: hike.user ? hike.user.name : 'Unknown User',
        avatar: hike.user && hike.user.profileImage ? process.env.API_URL + '/' + hike.user.profileImage : null,
        time: hike.endDateTime || hike.updatedAt,
        trail: hike.trail ? hike.trail.name : 'Unknown Trail',
        description: 'completed a hike'
    })));

    // 5. Reviews Posted
    const reviews = await Review.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate('user', 'name profileImage')
        .populate('trail', 'name');

    allActivity.push(...reviews.map(review => ({
        id: `review_${review._id}`,
        type: 'review_posted',
        user: review.user ? review.user.name : 'Unknown User',
        avatar: review.user && review.user.profileImage ? process.env.API_URL + '/' + review.user.profileImage : null,
        time: review.createdAt,
        trail: review.trail ? review.trail.name : 'Unknown Trail',
        description: 'posted a review'
    })));

    // 6. Posts Created
    const posts = await Post.find({ author: userId })
        .sort({ createdAt: -1 })
        .populate('author', 'name profileImage')
        .populate('group', 'name');

    allActivity.push(...posts.map(post => ({
        id: `post_${post._id}`,
        type: 'post_created',
        user: post.author ? post.author.name : 'Unknown User',
        avatar: post.author && post.author.profileImage ? process.env.API_URL + '/' + post.author.profileImage : null,
        time: post.createdAt,
        trail: post.group ? post.group.name : null,
        description: 'created a post'
    })));

    // 7. Events Created
    const events = await Event.find({ host: userId })
        .sort({ createdAt: -1 })
        .populate('host', 'name profileImage')
        .populate('group', 'name');

    allActivity.push(...events.map(event => ({
        id: `event_${event._id}`,
        type: 'event_created',
        user: event.host ? event.host.name : 'Unknown User',
        avatar: event.host && event.host.profileImage ? process.env.API_URL + '/' + event.host.profileImage : null,
        time: event.createdAt,
        trail: event.group ? event.group.name : event.title,
        description: 'created an event'
    })));

    // 8. Payments Made
    const payments = await Payment.find({ userId: userId, status: 'success' })
        .sort({ createdAt: -1 })
        .populate('userId', 'name profileImage');

    allActivity.push(...payments.map(payment => ({
        id: `payment_${payment._id}`,
        type: 'payment_made',
        user: payment.userId ? payment.userId.name : 'Unknown User',
        avatar: payment.userId && payment.userId.profileImage ? process.env.API_URL + '/' + payment.userId.profileImage : null,
        time: payment.createdAt,
        trail: `$${payment.amount}`,
        description: 'made a payment'
    })));

    // Sort all activities by time (most recent first)
    allActivity.sort((a, b) => new Date(b.time) - new Date(a.time));

    // Return activities
    res.status(200).json({
        success: true,
        count: allActivity.length,
        data: allActivity.slice(0, limit),
        user: user ? { name: user.name, avatar: user.profileImage } : null
    });
});
