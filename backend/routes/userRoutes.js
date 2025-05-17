const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// get ranked users for leaderboard
router.get('/ranked', userController.getRankedUsers);

// apply protect middleware to all routes below this point
router.use(protect);

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
