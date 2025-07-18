const express = require('express');
const router = express.Router();
const {
  getSubjects,
  createSubject,
  assignStudentToSubject,
  assignTeacherToSubject,
  getStudentSubjects,
  getTeacherSubjects,
} = require('../controllers/subjectController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getSubjects).post(protect, admin, createSubject);
router.route('/student').get(protect, getStudentSubjects).post(protect, admin, assignStudentToSubject);
router.route('/teacher').get(protect, getTeacherSubjects).post(protect, admin, assignTeacherToSubject);

module.exports = router;
