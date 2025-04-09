// examind-backend/routes/quizRoutes.js
const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
// Import question controller logic (we can place it in quizController for simplicity, or a new file)
const questionController = require('../controllers/quizController'); // Or require('../controllers/questionController') if separated

// const { protect, restrictTo } = require('../middleware/authMiddleware'); // TODO: Add later

// --- Quiz Routes ---
router.get('/', quizController.getAllQuizzes);
router.get('/:id', quizController.getQuizByIdWithQuestions);
// TODO: protect, restrictTo('admin', 'teacher')
router.post('/', quizController.createQuiz);
// TODO: protect, restrictTo('admin', 'teacher')
router.put('/:id', quizController.updateQuiz);
// TODO: protect, restrictTo('admin', 'teacher')
router.delete('/:id', quizController.deleteQuiz);

// --- Question Routes (nested under a specific quiz) ---

// POST /api/v1/quizzes/:quizId/questions - Add a question to a specific quiz
// TODO: protect, restrictTo('admin', 'teacher')
router.post('/:quizId/questions', questionController.addQuestionToQuiz);

// PUT /api/v1/quizzes/:quizId/questions/:questionId - Update a specific question
// TODO: protect, restrictTo('admin', 'teacher')
router.put('/:quizId/questions/:questionId', questionController.updateQuestion);

// DELETE /api/v1/quizzes/:quizId/questions/:questionId - Delete a specific question
// TODO: protect, restrictTo('admin', 'teacher')
router.delete('/:quizId/questions/:questionId', questionController.deleteQuestion);

module.exports = router;