const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController.js');
//const postController = require('../controllers/postController'); //for fetching posts
const { protect, restrictTo } = require('../middleware/authMiddleware'); //import middleware

//forum topic routes

//get all forum topics 
router.get('/', discussionController.getAllForums);

//get single forum topic
router.get('/:forumId', discussionController.getForumById);

//create a new forum topic
router.post('/', protect, discussionController.createForum);

//update a forum topic
router.put('/:forumId', protect, restrictTo('admin', 'teacher'), discussionController.updateForum);

//delete a forum topic 
router.delete('/:forumId', protect, restrictTo('admin', 'teacher'), discussionController.deleteForum);

//post routes 

//get all posts 
//router.get('/:forumId/posts', postController.getPostsByForumId);

//create a new post
//router.post('/:forumId/posts', protect, postController.createPost);

//upvote a post
//router.post('/:postId/upvote', protect, postController.upvotePost);


module.exports = router;
