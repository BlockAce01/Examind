// examind-backend/controllers/quizController.js
const db = require('../config/db');

// Get All Quizzes (including question count) - CORRECTED
exports.getAllQuizzes = async (req, res, next) => {
    try {
        // Query to get quizzes and count of associated questions
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
                quizzes: rows,
            },
        });
    } catch (err) {
        // IMPORTANT: Check your backend server console logs for the specific error message
        console.error('Error fetching quizzes:', err.stack || err); // Log the full error stack
        next(err); // Pass error to the global error handler
    }
};

// Get Single Quiz by ID (including its Questions) - CORRECTED WITH LOGGING
exports.getQuizByIdWithQuestions = async (req, res, next) => {
    const { id } = req.params;
    // Validate ID parameter
    const quizIdNum = parseInt(id, 10);
    if (isNaN(quizIdNum)) {
        console.log(`[getQuizByIdWithQuestions] Invalid ID parameter received: ${id}`);
        return res.status(400).json({ message: 'Invalid Quiz ID format.' });
    }
    console.log(`[getQuizByIdWithQuestions] Attempting to fetch quiz with ID: ${quizIdNum}`);

    try {
        // --- Fetch quiz details ---
        console.log(`[getQuizByIdWithQuestions] Executing quiz query for ID: ${quizIdNum}`);
        const quizQuery = 'SELECT * FROM "Quiz" WHERE "QuizID" = $1';
        const quizResult = await db.query(quizQuery, [quizIdNum]);
        console.log(`[getQuizByIdWithQuestions] Quiz query completed. Row count: ${quizResult.rows.length}`);

        if (quizResult.rows.length === 0) {
            console.log(`[getQuizByIdWithQuestions] Quiz ID ${quizIdNum} not found. Sending 404.`);
            return res.status(404).json({ message: 'Quiz not found' });
        }
        const quiz = quizResult.rows[0];
        console.log(`[getQuizByIdWithQuestions] Quiz details fetched successfully.`);

        // --- Fetch associated questions ---
        console.log(`[getQuizByIdWithQuestions] Executing questions query for QuizID: ${quizIdNum}`);
        const questionsQuery = `
            SELECT "QuestionID", "Text", "Options", "CorrectAnswerIndex"
            FROM "Question"
            WHERE "QuizID" = $1
            ORDER BY "QuestionID" ASC;
        `;
        const questionsResult = await db.query(questionsQuery, [quizIdNum]);
        console.log(`[getQuizByIdWithQuestions] Questions query completed. Row count: ${questionsResult.rows.length}`);

        // Attach questions to the quiz object
        quiz.questions = questionsResult.rows;
        console.log(`[getQuizByIdWithQuestions] Attached ${questionsResult.rows.length} questions.`);

        // --- Send the successful response ---
        console.log(`[getQuizByIdWithQuestions] Sending 200 success response for Quiz ID: ${quizIdNum}`);
        res.status(200).json({
            status: 'success',
            data: {
                quiz: quiz,
            },
        });
        console.log(`[getQuizByIdWithQuestions] Success response sent for Quiz ID: ${quizIdNum}`);

    } catch (err) {
        console.error(`--- ERROR in getQuizByIdWithQuestions for ID: ${id} ---`);
        console.error("Error Message:", err.message);
        console.error("Error Stack:", err.stack || 'No stack available');
        console.error("Error Code:", err.code);
        console.error(`-------------------------------------------------------`);
        next(err);
    }
};

// Create New Quiz (Quiz details only)
exports.createQuiz = async (req, res, next) => {
    const { Title, Subject, DifficultyLevel, TimeLimit } = req.body;
    if (!Title || !Subject || !DifficultyLevel || !TimeLimit) {
        return res.status(400).json({ message: 'Missing required fields: Title, Subject, DifficultyLevel, TimeLimit' });
    }
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
        res.status(201).json({ status: 'success', data: { quiz: rows[0] } });
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
    try {
        const query = `
            UPDATE "Quiz"
            SET "Title" = $1, "Subject" = $2, "DifficultyLevel" = $3, "TimeLimit" = $4
            WHERE "QuizID" = $5
            RETURNING *;
        `;
        const values = [Title, Subject, DifficultyLevel, TimeLimit, id];
        const { rows } = await db.query(query, values);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Quiz not found or no changes needed' });
        }
        res.status(200).json({ status: 'success', data: { quiz: rows[0] } });
    } catch (err) {
        console.error(`Error updating quiz ${id}:`, err);
        next(err);
    }
};

// Delete Quiz (and associated Questions via CASCADE)
exports.deleteQuiz = async (req, res, next) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM "Quiz" WHERE "QuizID" = $1 RETURNING *;';
        const { rows } = await db.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        console.error(`Error deleting quiz ${id}:`, err);
        next(err);
    }
};

// --- NEW Question Controller Functions ---

// Add a Question to a Specific Quiz
exports.addQuestionToQuiz = async (req, res, next) => {
    const { quizId } = req.params;
    const { Text, Options, CorrectAnswerIndex } = req.body;
    if (!Text || !Options || Options.length === 0 || CorrectAnswerIndex === undefined || CorrectAnswerIndex === null) {
        return res.status(400).json({ message: 'Missing required fields: Text, Options array, CorrectAnswerIndex' });
    }
    if (!Array.isArray(Options)) {
        return res.status(400).json({ message: 'Options must be an array of strings.' });
    }
     if (typeof CorrectAnswerIndex !== 'number' || CorrectAnswerIndex < 0 || CorrectAnswerIndex >= Options.length ) {
         return res.status(400).json({ message: 'CorrectAnswerIndex must be a valid index within the Options array.' });
     }
    try {
        const quizExists = await db.query('SELECT 1 FROM "Quiz" WHERE "QuizID" = $1', [quizId]);
        if (quizExists.rows.length === 0) {
             return res.status(404).json({ message: `Quiz with ID ${quizId} not found.` });
        }
        const query = `
            INSERT INTO "Question" ("QuizID", "Text", "Options", "CorrectAnswerIndex")
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [quizId, Text, Options, CorrectAnswerIndex];
        const { rows } = await db.query(query, values);
        res.status(201).json({ status: 'success', data: { question: rows[0] } });
    } catch (err) {
        console.error(`Error adding question to quiz ${quizId}:`, err);
        next(err);
    }
};

// Update a Specific Question
exports.updateQuestion = async (req, res, next) => {
    const { quizId, questionId } = req.params;
    const { Text, Options, CorrectAnswerIndex } = req.body;
    if (Text === undefined && Options === undefined && CorrectAnswerIndex === undefined) {
        return res.status(400).json({ message: 'No update data provided for the question.' });
    }
     if (Options && !Array.isArray(Options)) { return res.status(400).json({ message: 'Options must be an array.' }); }
     if (CorrectAnswerIndex !== undefined && (typeof CorrectAnswerIndex !== 'number' || CorrectAnswerIndex < 0)) { return res.status(400).json({ message: 'CorrectAnswerIndex must be a non-negative number.' }); }
    try {
        const query = `
            UPDATE "Question"
            SET "Text" = COALESCE($1, "Text"),
                "Options" = COALESCE($2, "Options"),
                "CorrectAnswerIndex" = COALESCE($3, "CorrectAnswerIndex")
            WHERE "QuestionID" = $4 AND "QuizID" = $5
            RETURNING *;
        `;
        const values = [Text, Options, CorrectAnswerIndex, questionId, quizId];
        const { rows } = await db.query(query, values);
        if (rows.length === 0) {
            return res.status(404).json({ message: `Question with ID ${questionId} not found within quiz ID ${quizId}.` });
        }
        res.status(200).json({ status: 'success', data: { question: rows[0] } });
    } catch (err) {
        console.error(`Error updating question ${questionId} in quiz ${quizId}:`, err);
        next(err);
    }
};

// Delete a Specific Question
exports.deleteQuestion = async (req, res, next) => {
    const { quizId, questionId } = req.params;
    try {
        const query = `
            DELETE FROM "Question"
            WHERE "QuestionID" = $1 AND "QuizID" = $2
            RETURNING *;`;
        const { rows } = await db.query(query, [questionId, quizId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: `Question with ID ${questionId} not found within quiz ID ${quizId}.` });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        console.error(`Error deleting question ${questionId} from quiz ${quizId}:`, err);
        next(err);
    }
};