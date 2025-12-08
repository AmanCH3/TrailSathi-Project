const Post = require('../models/Post');
const PostLike = require('../models/PostLike');
const Comment = require('../models/Comment');
const Group = require('../models/Group');
const GroupMembership = require('../models/GroupMembership');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

// Helper to check membership
const checkMembership = async (groupId, userId) => {
    const membership = await GroupMembership.findOne({ group: groupId, user: userId, status: 'active' });
    return !!membership;
};

exports.getAllPosts = catchAsync(async (req, res, next) => {
    const { groupId } = req.params;
    
    // Check if group exists (optional but good)
    const group = await Group.findById(groupId);
    if (!group) return next(new AppError('Group not found', 404));

    // Allow fetching posts only if member? 
    // Requirement says "protected", usually private groups require membership. 
    // If public group, maybe allow? 
    // For simplicity, we assume if you can hit this route (protected), you can see posts if group is public OR you are member.
    // Logic: if group.privacy === 'private', user must be member.
    if (group.privacy === 'private') {
        const isMember = await checkMembership(groupId, req.user.id);
        if (!isMember) return next(new AppError('This is a private group. You must join to view posts.', 403));
    }

    const features = new APIFeatures(Post.find({ group: groupId }), req.query)
        .sort() // Default sort via query usually provided, else default to -createdAt in code?
        .paginate();

    // Force default sort if not present
    if (!req.query.sort) {
        features.query = features.query.sort('-createdAt');
    }

    const posts = await features.query
        .populate('author', 'name profileImage')
        .populate('group', 'name');

    // Check if current user liked these posts?
    // This is often heavy. Frontend might query likes separately or we aggregate.
    // Simple way: just return posts.

    res.status(200).json({
        success: true,
        results: posts.length,
        data: {
            posts
        }
    });
});

exports.createPost = catchAsync(async (req, res, next) => {
    const { groupId } = req.params;

    // Check membership
    const isMember = await checkMembership(groupId, req.user.id);
    if (!isMember) {
        return next(new AppError('Only group members can post.', 403));
    }

    const newPost = await Post.create({
        ...req.body,
        group: groupId,
        author: req.user.id
    });

    // Increment group postCount
    await Group.findByIdAndUpdate(groupId, { $inc: { postCount: 1 } });

    res.status(201).json({
        success: true,
        data: {
            post: newPost
        }
    });
});

exports.updatePost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.postId);

    if (!post) {
        return next(new AppError('No post found with that ID', 404));
    }
    
    // Check ownership or admin
    // Note: To check if admin, need to look up group -> membership. 
    // Simplified: Author only. If admin is needed, I'd fetch group membership.
    // Requirement: "Author or admin can edit."
    let isAuthorized = post.author.toString() === req.user.id;
    if (!isAuthorized) {
        // Check if admin of the group
        const membership = await GroupMembership.findOne({ group: post.group, user: req.user.id });
        if (membership && (membership.role === 'admin' || membership.role === 'owner')) {
            isAuthorized = true;
        }
    }

    if (!isAuthorized) {
        return next(new AppError('You do not have permission to edit this post', 403));
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {
        content: req.body.content,
        images: req.body.images,
        trailName: req.body.trailName
    }, { new: true, runValidators: true });

    res.status(200).json({
        success: true,
        data: {
            post: updatedPost
        }
    });
});

exports.deletePost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.postId);

    if (!post) return next(new AppError('Post not found', 404));

    let isAuthorized = post.author.toString() === req.user.id;
    if (!isAuthorized) {
         const membership = await GroupMembership.findOne({ group: post.group, user: req.user.id });
         if (membership && (membership.role === 'admin' || membership.role === 'owner')) {
             isAuthorized = true;
         }
    }

    if (!isAuthorized) return next(new AppError('Permission denied', 403));

    await Post.findByIdAndDelete(req.params.postId);
    
    // Decrement post count
    await Group.findByIdAndUpdate(post.group, { $inc: { postCount: -1 } });

    res.status(204).json({
        success: true,
        data: null
    });
});

exports.likePost = catchAsync(async (req, res, next) => {
    const { postId } = req.params;

    // Check if already liked
    const existingLike = await PostLike.findOne({ post: postId, user: req.user.id });
    if (existingLike) {
        return next(new AppError('You already liked this post', 400));
    }

    await PostLike.create({ post: postId, user: req.user.id });

    // Increment like count
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });

    res.status(200).json({
        success: true,
        message: 'Post liked'
    });
});

exports.unlikePost = catchAsync(async (req, res, next) => {
    const { postId } = req.params;

    const like = await PostLike.findOneAndDelete({ post: postId, user: req.user.id });
    if (!like) {
        return next(new AppError('You have not liked this post', 400));
    }

    // Decrement like count
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });

    res.status(200).json({
        success: true,
        message: 'Post unliked'
    });
});

// Basic Comment controllers as implied support
exports.createComment = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return next(new AppError('dPost not found', 404));

    // Check membership in group?
    // Assuming same rules as post creation
    const isMember = await checkMembership(post.group, req.user.id);
    if (!isMember) return next(new AppError('Join group to comment', 403));

    const comment = await Comment.create({
        post: postId,
        author: req.user.id,
        content: req.body.content
    });

    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    res.status(201).json({
        success: true,
        data: { comment }
    });
});

exports.getComments = catchAsync(async (req, res, next) => {
    const comments = await Comment.find({ post: req.params.postId })
        .sort('createdAt')
        .populate('author', 'name profileImage');
        
    res.status(200).json({
        success: true,
        results: comments.length,
        data: { comments }
    });
});
