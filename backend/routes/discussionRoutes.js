// backend/routes/discussionRoutes.js
const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController.js'); // Create next
const postController = require('../controllers/postController'); // For fetching posts
// const { protect, restrictTo } = require('../middleware/authMiddleware'); // TODO: Add later

// --- Forum Topic Routes ---

// GET /api/v1/discussions - Get all forum topics (public)
router.get('/', discussionController.getAllForums);

// GET /api/v1/discussions/:forumId - Get a single forum topic (public)
router.get('/:forumId', discussionController.getForumById);

// POST /api/v1/discussions - Create a new forum topic
// TODO: Add middleware: protect, restrictTo('admin', 'teacher')
router.post('/', discussionController.createForum);

// PUT /api/v1/discussions/:forumId - Update a forum topic
// TODO: Add middleware: protect, restrictTo('admin', 'teacher')
router.put('/:forumId', discussionController.updateForum);

// DELETE /api/v1/discussions/:forumId - Delete a forum topic
// TODO: Add middleware: protect, restrictTo('admin', 'teacher')
router.delete('/:forumId', discussionController.deleteForum);

// --- Post Routes (Nested under Discussions/Forums) ---

// GET /api/v1/discussions/:forumId/posts - Get all posts for a specific forum (public)
router.get('/:forumId/posts', postController.getPostsByForumId);

// POST /api/v1/discussions/:forumId/posts - Create a new post in a specific forum
// TODO: Add middleware: protect (any logged-in user can post)
router.post('/:forumId/posts', postController.createPost);

// --- TODO: Routes for managing individual Posts ---
// Example: PUT /api/v1/posts/:postId - Update a post (user owns post, or admin/teacher)
// Example: DELETE /api/v1/posts/:postId - Delete a post (user owns post, or admin/teacher)
// Example: POST /api/v1/posts/:postId/upvote - Upvote a post

module.exports = router;