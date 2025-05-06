const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware'); // Import the middleware

// Apply protect middleware to all routes below this point
router.use(protect);

// Apply restrictTo('admin') middleware to all routes below this point
router.use(restrictTo('admin'));

// Get all users (admin only)
router.get('/', userController.getAllUsers);

// Get single user (admin only)
router.get('/:id', userController.getUserById);

// Update user (admin only )
router.put('/:id', userController.updateUser);

// Delete user (admin only)
router.delete('/:id', userController.deleteUser);

module.exports = router;
