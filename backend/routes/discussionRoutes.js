const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController.js');
const postController = require('../controllers/postController'); 
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Forum Topic Routes

//  Get all forum topics (public)
router.get('/', discussionController.getAllForums);

// forumId  Get a single forum topic (public)
router.get('/:forumId', discussionController.getForumById);

// Create a new forum topic (Any logged-in user)
router.post('/', protect, discussionController.createForum);

// forumId  Update a forum topic (Admin/Teacher only)
router.put('/:forumId', protect, restrictTo('admin', 'teacher'), discussionController.updateForum);

// forumId  Delete a forum topic (Admin/Teacher only)
router.delete('/:forumId', protect, restrictTo('admin', 'teacher'), discussionController.deleteForum);

// Post Routes

// forumId/posts  Get all posts for a specific forum (public)
router.get('/:forumId/posts', postController.getPostsByForumId);

// forumId/posts  Create a new post in a specific forum (Any logged-in user)
router.post('/:forumId/posts', protect, postController.createPost);

router.post('/:postId/upvote', protect, postController.upvotePost);


module.exports = router;
