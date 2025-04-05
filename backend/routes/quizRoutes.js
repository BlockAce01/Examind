const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController'); // Create next
// const { protect, restrictTo } = require('../middleware/authMiddleware'); // TODO: Add later

// GET /api/v1/quizzes - Get all quizzes (public)
router.get('/', quizController.getAllQuizzes);

// GET /api/v1/quizzes/:id - Get a single quiz with its questions (public)
router.get('/:id', quizController.getQuizByIdWithQuestions);

// POST /api/v1/quizzes - Create a new quiz (Quiz details only for now)
// TODO: Add middleware: protect, restrictTo('admin', 'teacher')
router.post('/', quizController.createQuiz);

// PUT /api/v1/quizzes/:id - Update quiz details
// TODO: Add middleware: protect, restrictTo('admin', 'teacher')
router.put('/:id', quizController.updateQuiz);

// DELETE /api/v1/quizzes/:id - Delete a quiz (and its questions via cascade)
// TODO: Add middleware: protect, restrictTo('admin', 'teacher')
router.delete('/:id', quizController.deleteQuiz);

// --- TODO: Routes for managing Questions within a Quiz ---
// Example: POST /api/v1/quizzes/:quizId/questions - Add a question
// Example: PUT /api/v1/quizzes/:quizId/questions/:questionId - Update a question
// Example: DELETE /api/v1/quizzes/:quizId/questions/:questionId - Delete a question

module.exports = router;