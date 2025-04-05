// examind-backend\controllers\quizController.js
const db = require('../config/db');

// Get All Quizzes (including question count)
exports.getAllQuizzes = async (req, res, next) => {
    try {
        // Query to get quizzes and count of associated questions
        // Ensure column names ("QuizID", "Title", etc.) match your schema exactly
        const query = `
            SELECT
                q."QuizID",
                q."Title",
                q."Subject",
                q."DifficultyLevel",
                q."TimeLimit",
                COUNT(qu."QuestionID")::int AS "questionCount"
            FROM "Quiz" q
            LEFT JOIN "Question" qu ON q."QuizID" = qu."QuizID"
            GROUP BY
                q."QuizID",         -- Group by the primary key
                q."Title",          -- Also group by other selected non-aggregated columns
                q."Subject",
                q."DifficultyLevel",
                q."TimeLimit"
            ORDER BY q."QuizID" ASC;
    `;
    const { rows } = await db.query(query);
    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: {
            quizzes: rows, // 'rows' contains objects with "questionCount"
        },
    });
    } catch (err) {
        console.error('Error fetching quizzes:', err);
        next(err);
    }
};

// Get Single Quiz by ID (including its Questions)
exports.getQuizByIdWithQuestions = async (req, res, next) => {
    const { id } = req.params;
    try {
        // Fetch quiz details
        const quizQuery = 'SELECT * FROM "Quiz" WHERE "QuizID" = $1';
        const quizResult = await db.query(quizQuery, [id]);

        if (quizResult.rows.length === 0) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        const quiz = quizResult.rows[0];

        // Fetch associated questions
        // Ensure columns match ("QuestionID", "Text", "Options", "CorrectAnswerIndex")
        const questionsQuery = 'SELECT "QuestionID", "Text", "Options", "CorrectAnswerIndex" FROM "Question" WHERE "QuizID" = $1 ORDER BY "QuestionID" ASC';
        const questionsResult = await db.query(questionsQuery, [id]);
        quiz.questions = questionsResult.rows; // Attach questions to the quiz object

        res.status(200).json({
            status: 'success',
            data: {
                quiz: quiz,
            },
        });
    } catch (err) {
        console.error(`Error fetching quiz ${id} with questions:`, err);
        next(err);
    }
};

// Create New Quiz (Quiz details only)
exports.createQuiz = async (req, res, next) => {
    // Ensure request body keys match database columns exactly
    const { Title, Subject, DifficultyLevel, TimeLimit } = req.body;

    if (!Title || !Subject || !DifficultyLevel || !TimeLimit) {
        return res.status(400).json({ message: 'Missing required fields: Title, Subject, DifficultyLevel, TimeLimit' });
    }

    // Validate DifficultyLevel against check constraint if possible server-side
    const validDifficulties = ['Easy', 'Medium', 'Hard'];
    if (!validDifficulties.includes(DifficultyLevel)) {
         return res.status(400).json({ message: 'Invalid DifficultyLevel. Must be Easy, Medium, or Hard.' });
    }

    try {
        const query = `
            INSERT INTO "Quiz" ("Title", "Subject", "DifficultyLevel", "TimeLimit")
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [Title, Subject, DifficultyLevel, TimeLimit];
        const { rows } = await db.query(query, values);

        res.status(201).json({
            status: 'success',
            data: {
                quiz: rows[0],
            },
        });
        // TODO: Handle adding questions in a subsequent step or different endpoint
    } catch (err) {
        console.error('Error creating quiz:', err);
        next(err);
    }
};

// Update Quiz Details
exports.updateQuiz = async (req, res, next) => {
    const { id } = req.params;
    const { Title, Subject, DifficultyLevel, TimeLimit } = req.body;

    if (!Title && !Subject && !DifficultyLevel && !TimeLimit) {
        return res.status(400).json({ message: 'No update data provided.' });
    }
    // Add validation for DifficultyLevel if provided

    try {
        const query = `
            UPDATE "Quiz"
            SET "Title" = $1, "Subject" = $2, "DifficultyLevel" = $3, "TimeLimit" = $4
            WHERE "QuizID" = $5
            RETURNING *;
        `;
        const values = [Title, Subject, DifficultyLevel, TimeLimit, id];
        // Consider fetching first and only updating provided fields for robustness

        const { rows } = await db.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Quiz not found or no changes needed' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                quiz: rows[0],
            },
        });
        // TODO: Handle updating questions separately
    } catch (err) {
        console.error(`Error updating quiz ${id}:`, err);
        next(err);
    }
};

// Delete Quiz (and associated Questions via CASCADE)
exports.deleteQuiz = async (req, res, next) => {
    const { id } = req.params;
    try {
        // The DELETE CASCADE constraint on the Question table handles question deletion
        const query = 'DELETE FROM "Quiz" WHERE "QuizID" = $1 RETURNING *;';
        const { rows } = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.status(204).json({ // 204 No Content
            status: 'success',
            data: null,
        });
    } catch (err) {
        console.error(`Error deleting quiz ${id}:`, err);
        next(err);
    }
};