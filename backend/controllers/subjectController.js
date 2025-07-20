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
  const { UserID, subjectId } = req.body;
  try {
    await pool.query(
      'INSERT INTO "StudentSubject" ("UserID", "SubjectID") VALUES ($1, $2)',
      [UserID, subjectId]
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
    const { UserID, subjectId } = req.body;
    try {
      await pool.query(
        'INSERT INTO "TeacherSubject" ("UserID", "SubjectID") VALUES ($1, $2)',
        [UserID, subjectId]
      );
      res.json({ msg: 'Teacher assigned to subject' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  

// @desc    Get subjects for a student
// @route   GET /api/subjects/student
// @access  Private
const getStudentSubjects = async (req, res) => {
    try {
        const studentSubjects = await pool.query(
            'SELECT "Subject"."SubjectID", "Subject"."Name" FROM "Subject" JOIN "StudentSubject" ON "Subject"."SubjectID" = "StudentSubject"."SubjectID" WHERE "StudentSubject"."UserID" = $1',
            [req.user.UserID]
        );
        res.json(studentSubjects.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get subjects for a teacher
// @route   GET /api/subjects/teacher
// @access  Private
const getTeacherSubjects = async (req, res) => {
    try {
        const teacherSubjects = await pool.query(
            'SELECT "Subject"."SubjectID", "Subject"."Name" FROM "Subject" JOIN "TeacherSubject" ON "Subject"."SubjectID" = "TeacherSubject"."SubjectID" WHERE "TeacherSubject"."UserID" = $1',
            [req.user.UserID]
        );
        res.json(teacherSubjects.rows);
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
  getStudentSubjects,
  getTeacherSubjects,
};
