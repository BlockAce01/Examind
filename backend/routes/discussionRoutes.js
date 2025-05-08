const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController.js');
const postController = require('../controllers/postController'); // For fetching posts
const { protect, restrictTo } = require('../middleware/authMiddleware'); // Import middleware

// forum topic 

//get all forum topics-public
router.get('/', discussionController.getAllForums);

//get single forum topic-public
router.get('/:forumId', discussionController.getForumById);

//create a new forum topic-any logged-in user
router.post('/', protect, discussionController.createForum);

//update a forum topic-admin/teacher only
router.put('/:forumId', protect, restrictTo('admin', 'teacher'), discussionController.updateForum);

//delete a forum topic-admin/teacher only
router.delete('/:forumId', protect, restrictTo('admin', 'teacher'), discussionController.deleteForum);

//post routes

//get all posts -public
router.get('/:forumId/posts', postController.getPostsByForumId);

//create new post -any logged-in user)
router.post('/:forumId/posts', protect, postController.createPost);

//upvote post
router.post('/:postId/upvote', protect, postController.upvotePost);


module.exports = router;
