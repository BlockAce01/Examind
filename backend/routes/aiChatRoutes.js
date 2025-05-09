const express = require('express');
const router = express.Router();
const { getAIExplanation } = require('../controllers/aiChatController');

// @route   POST /api/ai-chat/explanation
// @desc    Get AI explanation for selected quiz questions
// @access  Public (or Private if you have auth middleware)
router.post('/explanation', getAIExplanation);

module.exports = router;