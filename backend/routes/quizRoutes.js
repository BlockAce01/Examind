
const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const questionController = require('../controllers/quizController'); 



router.get('/', quizController.getAllQuizzes);
router.get('/:id', quizController.getQuizByIdWithQuestions);
router.post('/', quizController.createQuiz); 
router.put('/:id', quizController.updateQuiz); 
router.delete('/:id', quizController.deleteQuiz); 

 //question Routes 
router.post('/:quizId/questions', questionController.addQuestionToQuiz); 
router.put('/:quizId/questions/:questionId', questionController.updateQuestion); 
router.delete('/:quizId/questions/:questionId', questionController.deleteQuestion);

//  quiz submission route 
router.post('/:quizId/submit', quizController.submitQuiz); 

// quiz result route

router.get('/:quizId/result', quizController.getQuizResultForUser); 

module.exports = router;