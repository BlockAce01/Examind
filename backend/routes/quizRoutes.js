// examind-backend/routes/quizRoutes.js
const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const questionController = require('../controllers/quizController'); // Using same controller

// const { protect, restrictTo } = require('../middleware/authMiddleware');

// --- Quiz Routes ---
router.get('/', quizController.getAllQuizzes);
router.get('/:id', quizController.getQuizByIdWithQuestions);
router.post('/', quizController.createQuiz); // TODO: Protect
router.put('/:id', quizController.updateQuiz); // TODO: Protect
router.delete('/:id', quizController.deleteQuiz); // TODO: Protect

// --- Question Routes ---
router.post('/:quizId/questions', questionController.addQuestionToQuiz); // TODO: Protect
router.put('/:quizId/questions/:questionId', questionController.updateQuestion); // TODO: Protect
router.delete('/:quizId/questions/:questionId', questionController.deleteQuestion); // TODO: Protect

// --- Quiz Submission Route ---
router.post('/:quizId/submit', quizController.submitQuiz); // TODO: Protect (user)

// --- Quiz Result Route ---
// GET /api/v1/quizzes/:quizId/result
router.get('/:quizId/result', quizController.getQuizResultForUser); // Corrected to GET // TODO: Protect (user)

module.exports = router;