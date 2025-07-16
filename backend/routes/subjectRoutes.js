const express = require('express');
const router = express.Router();
const {
  getSubjects,
  createSubject,
  assignStudentToSubject,
  assignTeacherToSubject,
} = require('../controllers/subjectController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getSubjects).post(protect, admin, createSubject);
router.route('/student').post(protect, admin, assignStudentToSubject);
router.route('/teacher').post(protect, admin, assignTeacherToSubject);

module.exports = router;
