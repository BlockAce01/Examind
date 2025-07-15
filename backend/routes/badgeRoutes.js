const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badgeController');
const { protect } = require('../middleware/authMiddleware');

//trigger badge check for a user
router.post('/check/:userId', protect, badgeController.checkAndAwardBadges);

module.exports = router;
