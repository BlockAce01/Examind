const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// get ranked users for leaderboard
router.get('/ranked', userController.getRankedUsers);

// apply protect middleware to all routes below this point
router.use(protect);

// get the current user's profile
router.get('/me', userController.getUserProfile);

// get user stats
router.get('/:id/stats', userController.getUserStats);

// get user badges
router.get('/:id/badges', userController.getUserBadges);

// get user's recent activity
router.get('/:id/activity', userController.getRecentActivity);

// apply restrictTo middleware to all routes below this point
router.use(restrictTo('admin'));

// get all users (admin only)
router.get('/', userController.getAllUsers);

// get single user (admin only)
router.get('/:id', userController.getUserById);

// update user (admin only )
router.put('/:id', userController.updateUser);

// delete user (admin only)
router.delete('/:id', userController.deleteUser);

module.exports = router;
