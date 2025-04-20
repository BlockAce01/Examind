// backend/routes/resourceRoutes.js
const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController'); // Create next
// Optional: Import authentication middleware if needed later
// const { protect, restrictTo } = require('../middleware/authMiddleware');

// GET /api/v1/resources - Get all resources (public access)
router.get('/', resourceController.getAllResources);

// GET /api/v1/resources/:id - Get a single resource (public access)
router.get('/:id', resourceController.getResourceById);

// POST /api/v1/resources - Create a new resource
// TODO: Add middleware: protect, restrictTo('admin', 'teacher')
router.post('/', resourceController.createResource);

// PUT /api/v1/resources/:id - Update a resource
// TODO: Add middleware: protect, restrictTo('admin', 'teacher')
router.put('/:id', resourceController.updateResource);

// DELETE /api/v1/resources/:id - Delete a resource
// TODO: Add middleware: protect, restrictTo('admin', 'teacher')
router.delete('/:id', resourceController.deleteResource);


module.exports = router;