const express = require('express');
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true }); 
// mergeParams needed because we mount this on /api/groups/:groupId/posts

// /api/posts OR /api/groups/:groupId/posts
router.route('/')
    .get(authMiddleware.protect, postController.getAllPosts)
    .post(authMiddleware.protect, postController.uploadPostImages, postController.createPost);

router.route('/:postId')
    .put(authMiddleware.protect, postController.updatePost)
    .delete(authMiddleware.protect, postController.deletePost);

router.post('/:postId/like', authMiddleware.protect, postController.likePost);
router.delete('/:postId/unlike', authMiddleware.protect, postController.unlikePost);

// Comments
router.route('/:postId/comments')
    .get(authMiddleware.protect, postController.getComments)
    .post(authMiddleware.protect, postController.createComment);

module.exports = router;
