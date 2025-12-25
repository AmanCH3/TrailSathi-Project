const express = require('express');
const groupController = require('../controllers/groupController');
const membershipController = require('../controllers/membershipController');
const authMiddleware = require('../middlewares/authMiddleware'); // protect, authorize

// Router with mergeParams if we want to mount other routers (we typically do)
const router = express.Router();

// Import other routers for nesting
// We will create these shortly
const postRouter = require('./postRoutes');
const eventRouter = require('./eventRoutes');
const messageRouter = require('./messageRoutes'); // For group chat

// Nested Routes
// /api/groups/:groupId/posts
router.use('/:groupId/posts', postRouter);
// /api/groups/:groupId/events
router.use('/:groupId/events', eventRouter);
// /api/groups/:groupId/messages -> Group Chat
// Route to messageRouter directly? or custom?
// messageRouter will likely need to handle this.
// For now, let's assume messageRouter handles generic message or specific? 
// Actually, let's make a specific 'groupMessageRouter' or similar if needed. 
// Or I can define the group chat specific route here. 
// Let's define it here for clarity if simple, or use a separate router if complex. 
// 'messageController.getGroupMessages' and 'sendGroupMessage' exist.
// Easier to put them here or in a dedicated groupMessageRouter.
// I'll put them here or use a specific Router.
// I'll just put them here for now to avoid too many files if not needed.
// Wait, I planned 'messageRoutes.js'. 
// I'll use `router.get('/:groupId/messages', messageController.getGroupMessages)` etc.
const messageController = require('../controllers/messageController');


// Public routes (or partially protected)
router.route('/')
    .get(authMiddleware.checkUser, groupController.getAllGroups)
    .post(authMiddleware.protect, groupController.uploadGroupImages, groupController.createGroup);

// --- NEW ROUTE FOR ADMIN PENDING REQUESTS ---
// MUST be before /:groupId to avoid "requests" being treated as an ID
router.get('/requests/pending', authMiddleware.protect, membershipController.getAllPendingRequests);

// --- GROUP APPROVAL ROUTES ---
// Get all pending groups (Admin only)
router.get('/pending-groups', authMiddleware.protect, authMiddleware.authorize('admin'), groupController.getPendingGroups);
// Get user's own pending groups
router.get('/my-pending-groups', authMiddleware.protect, groupController.getMyPendingGroups);
// Approve/Reject group (Admin only)
router.patch('/:groupId/approve', authMiddleware.protect, authMiddleware.authorize('admin'), groupController.approveGroup);
router.patch('/:groupId/reject', authMiddleware.protect, authMiddleware.authorize('admin'), groupController.rejectGroup);

router.route('/:groupId')
    .get(authMiddleware.protect, groupController.getGroup) 
    .put(authMiddleware.protect, groupController.uploadGroupImages, groupController.updateGroup) // owner/admin
    .delete(authMiddleware.protect, groupController.deleteGroup); // owner

// Membership Routes
router.post('/:groupId/join', authMiddleware.protect, membershipController.joinGroup);
router.post('/:groupId/request-join', authMiddleware.protect, membershipController.requestToJoinGroup); // Request
router.delete('/:groupId/leave', authMiddleware.protect, membershipController.leaveGroup);
router.get('/:groupId/members', authMiddleware.protect, membershipController.getGroupMembers);

// Request Approval/Denial
router.patch('/:groupId/requests/:requestId/approve', authMiddleware.protect, membershipController.approveJoinRequest);
router.patch('/:groupId/requests/:requestId/deny', authMiddleware.protect, membershipController.denyJoinRequest);

// Group Chat Routes
router.route('/:groupId/messages')
    .get(authMiddleware.protect, messageController.getGroupMessages)
    .post(authMiddleware.protect, messageController.sendGroupMessage);

module.exports = router;
