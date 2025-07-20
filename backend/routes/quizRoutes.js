
const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const questionController = require('../controllers/quizController');
const { protect, restrictTo } = require('../middleware/authMiddleware');



router.get('/', quizController.getAllQuizzes);
router.get('/:id', quizController.getQuizByIdWithQuestions);
router.post('/', protect, restrictTo('admin', 'teacher'), quizController.createQuiz); 
router.put('/:id', protect, restrictTo('admin', 'teacher'), quizController.updateQuiz); 
router.delete('/:id', protect, restrictTo('admin', 'teacher'), quizController.deleteQuiz);

 //question Routes 
router.post('/:quizId/questions', protect, restrictTo('admin', 'teacher'), questionController.addQuestionToQuiz); 
router.put('/:quizId/questions/:questionId', protect, restrictTo('admin', 'teacher'), questionController.updateQuestion); 
router.delete('/:quizId/questions/:questionId', protect, restrictTo('admin', 'teacher'), questionController.deleteQuestion);

 //quiz submission route
router.post('/:quizId/submit', protect, quizController.submitQuiz);

//quiz result route
router.get('/:quizId/result', protect, quizController.getQuizResultForUser);

module.exports = router;
