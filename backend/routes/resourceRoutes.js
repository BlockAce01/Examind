const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { protect, restrictTo } = require('../middleware/authMiddleware'); //import middleware

// GET /api/v1/resources - Get all resources (public access)
router.get('/', resourceController.getAllResources);

// GET /api/v1/resources/:id - Get a single resource (public access)
router.get('/:id', resourceController.getResourceById);

// POST /api/v1/resources - Create a new resource (Admin/Teacher only)
router.post('/', protect, restrictTo('admin', 'teacher'), resourceController.createResource);

// PUT /api/v1/resources/:id - Update a resource (Admin/Teacher only)
router.put('/:id', protect, restrictTo('admin', 'teacher'), resourceController.updateResource);

// DELETE /api/v1/resources/:id - Delete a resource (Admin/Teacher only)
router.delete('/:id', protect, restrictTo('admin', 'teacher'), resourceController.deleteResource);


module.exports = router;
