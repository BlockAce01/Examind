// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Create next
// const { protect, restrictTo } = require('../middleware/authMiddleware'); // TODO

// GET /api/v1/users - Get all users (admin only)
// TODO: protect, restrictTo('admin')
router.get('/', userController.getAllUsers);

// GET /api/v1/users/:id - Get single user (admin only)
// TODO: protect, restrictTo('admin')
router.get('/:id', userController.getUserById);

// PUT /api/v1/users/:id - Update user (admin only - e.g., for role changes)
// TODO: protect, restrictTo('admin')
router.put('/:id', userController.updateUser);

// DELETE /api/v1/users/:id - Delete user (admin only)
// TODO: protect, restrictTo('admin')
router.delete('/:id', userController.deleteUser);

module.exports = router;