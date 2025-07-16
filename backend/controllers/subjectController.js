const pool = require('../config/db');

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Public
const getSubjects = async (req, res) => {
  try {
    const allSubjects = await pool.query('SELECT * FROM "Subject"');
    res.json(allSubjects.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Admin
const createSubject = async (req, res) => {
  const { name, description } = req.body;
  try {
    const newSubject = await pool.query(
      'INSERT INTO "Subject" ("Name", "Description") VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.json(newSubject.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Assign a student to a subject
// @route   POST /api/subjects/student
// @access  Admin
const assignStudentToSubject = async (req, res) => {
  const { userId, subjectId } = req.body;
  try {
    await pool.query(
      'INSERT INTO "StudentSubject" ("UserID", "SubjectID") VALUES ($1, $2)',
      [userId, subjectId]
    );
    res.json({ msg: 'Student assigned to subject' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Assign a teacher to a subject
// @route   POST /api/subjects/teacher
// @access  Admin
const assignTeacherToSubject = async (req, res) => {
    const { userId, subjectId } = req.body;
    try {
      await pool.query(
        'INSERT INTO "TeacherSubject" ("UserID", "SubjectID") VALUES ($1, $2)',
        [userId, subjectId]
      );
      res.json({ msg: 'Teacher assigned to subject' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  

module.exports = {
  getSubjects,
  createSubject,
  assignStudentToSubject,
  assignTeacherToSubject,
};
