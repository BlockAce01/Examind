const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');

//protect all routes in this file
router.use(protect);

router.get('/quizzes', statsController.getQuizStats);
router.get('/resources', statsController.getResourceStats);
router.get('/discussions', statsController.getDiscussionStats);

module.exports = router;
