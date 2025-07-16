const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController.js');
const commentController = require('../controllers/commentController'); //for fetching comments
const { protect, restrictTo } = require('../middleware/authMiddleware'); //import middleware

//forum topic routes

//get all forum topics 
router.get('/', protect, discussionController.getAllForums);

//get single forum topic
router.get('/:forumId', discussionController.getForumById);

//create a new forum topic
router.post('/', protect, discussionController.createForum);

//update a forum topic
router.put('/:forumId', protect, restrictTo('admin', 'teacher'), discussionController.updateForum);

//delete a forum topic 
router.delete('/:forumId', protect, restrictTo('admin', 'teacher'), discussionController.deleteForum);

//comment routes 

//get all comments 
router.get('/:forumId/comments', commentController.getCommentsByForumId);

//create a new comment
router.post('/:forumId/comments', protect, commentController.createComment);

//upvote a comment
router.post('/:commentId/upvote', protect, commentController.upvoteComment);


module.exports = router;
