const db = require('../config/db');
const pool = require('../config/db').pool; // pool for transactions

// function to get all quizzes with their question count
exports.getAllQuizzes = async (req, res, next) => {
    try {
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
        //log the error if the query fails
        console.error('Error fetching quizzes:', err.stack || err);
        next(err);
    }
};

//get a specific quiz by ID along with its associated questions
exports.getQuizByIdWithQuestions = async (req, res, next) => {
    const { id } = req.params;
    const quizIdNum = parseInt(id, 10);
    if (isNaN(quizIdNum)) {
        console.log(`[getQuizByIdWithQuestions] Invalid ID parameter received: ${id}`);
        return res.status(400).json({ message: 'Invalid Quiz ID format.' });
    }
    console.log(`[getQuizByIdWithQuestions] Attempting to fetch quiz with ID: ${quizIdNum}`);

    try {
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
        console.log(`[getQuizByIdWithQuestions] Executing questions query for QuizID: ${quizIdNum}`);
        const questionsQuery = `
            SELECT "QuestionID", "Text", "Options", "CorrectAnswerIndex"
            FROM "Question"
            WHERE "QuizID" = $1
            ORDER BY "QuestionID" ASC;
        `;
        const questionsResult = await db.query(questionsQuery, [quizIdNum]);
        console.log(`[getQuizByIdWithQuestions] Questions query completed. Row count: ${questionsResult.rows.length}`);

        quiz.questions = questionsResult.rows;
        console.log(`[getQuizByIdWithQuestions] Attached ${questionsResult.rows.length} questions.`);
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

// create new quiz 
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

// update an existing quiz
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

// delete a quiz and its associated questions
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


// add a question to a specific quiz
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

// update a specific question in a quiz
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

// delete a specific question from a quiz
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

// submit the quiz answers and calculate the score
exports.submitQuiz = async (req, res, next) => {
    const { quizId } = req.params; 
    const { answers } = req.body; 
   
    const userId = req.user.UserID;

    if (!userId) { return res.status(401).json({ message: 'User not authenticated.' }); }
    const quizIdNum = parseInt(quizId, 10);
    if (isNaN(quizIdNum)) { return res.status(400).json({ message: 'Invalid Quiz ID format.' }); }
    if (!Array.isArray(answers)) { return res.status(400).json({ message: 'Invalid answers format. Expected an array.' }); }

    const client = await pool.connect();
    console.log(`[submitQuiz] User ${userId} submitting answers for Quiz ${quizIdNum}`);
    try {
        await client.query('BEGIN');
        console.log(`[submitQuiz] Fetching correct answers for Quiz ${quizIdNum}`);
        const questionsQuery = `
            SELECT "QuestionID", "CorrectAnswerIndex" FROM "Question"
            WHERE "QuizID" = $1 ORDER BY "QuestionID" ASC;
        `;
        const questionsResult = await client.query(questionsQuery, [quizIdNum]);
        const correctAnswers = questionsResult.rows;

        if (correctAnswers.length === 0) { throw new Error('Quiz has no questions or does not exist.'); }
        if (answers.length !== correctAnswers.length) { return res.status(400).json({ message: `Answer count mismatch. Expected ${correctAnswers.length} answers.` }); }

        let score = 0;
        correctAnswers.forEach((question, index) => {
            const userAnswer = answers[index];
            if (userAnswer !== null && typeof userAnswer === 'number' && userAnswer === question.CorrectAnswerIndex) { score++; }
        });
        const totalQuestions = correctAnswers.length;
        console.log(`[submitQuiz] Score calculated: ${score} / ${totalQuestions}`);

        // save user answers
        console.log(`[submitQuiz] Saving user answers for User ${userId}, Quiz ${quizIdNum}`);
        const userAnswerInserts = answers.map((answer, index) => {
            const questionId = correctAnswers[index].QuestionID;
            // handle cases when answer is null or undefined
            const submittedAnswerIndex = (answer === null || answer === undefined) ? null : answer;
            return `(${userId}, ${quizIdNum}, ${questionId}, ${submittedAnswerIndex})`;
        }).join(',');

        if (userAnswerInserts) {
             const insertUserAnswersQuery = `
                 INSERT INTO "UserAnswers" ("UserID", "QuizID", "QuestionID", "SubmittedAnswerIndex")
                 VALUES ${userAnswerInserts}
                 ON CONFLICT ("UserID", "QuizID", "QuestionID") DO UPDATE
                 SET "SubmittedAnswerIndex" = EXCLUDED."SubmittedAnswerIndex", "SubmissionTime" = NOW();
             `;
             await client.query(insertUserAnswersQuery);
             console.log(`[submitQuiz] User answers saved/updated in "UserAnswers" table.`);
        } else {
             console.log(`[submitQuiz] No user answers to save.`);
        }

        console.log(`[submitQuiz] Saving result for User ${userId}, Quiz ${quizIdNum}`);
        const takesQuery = `
            INSERT INTO "Takes" ("UserID", "QuizID", "MarksObtained", "SubmissionTime")
            VALUES ($1, $2, $3, NOW())
            ON CONFLICT ("UserID", "QuizID") DO UPDATE
            SET "MarksObtained" = EXCLUDED."MarksObtained", "SubmissionTime" = NOW()
            RETURNING *;
        `;
        const takesResult = await client.query(takesQuery, [userId, quizIdNum, score]);
        console.log(`[submitQuiz] Result saved/updated in "Takes" table. Row:`, takesResult.rows[0]);

        const pointsEarned = score * 5;
        if (pointsEarned > 0) {
             console.log(`[submitQuiz] Awarding ${pointsEarned} points to User ${userId}`);
             const pointsQuery = `UPDATE "User" SET "Points" = COALESCE("Points", 0) + $1 WHERE "UserID" = $2;`;
             await client.query(pointsQuery, [pointsEarned, userId]);
             console.log(`[submitQuiz] Points updated for User ${userId}`);
        }

        await client.query('COMMIT');
        console.log(`[submitQuiz] Sending success response for User ${userId}, Quiz ${quizIdNum}`);
        res.status(200).json({
            status: 'success', message: 'Quiz submitted successfully!',
            data: { score: score, totalQuestions: totalQuestions }
        });
        console.log(`[submitQuiz] Success response sent.`);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(`--- ERROR in submitQuiz for User ${userId}, Quiz ${quizIdNum} ---`);
        console.error("Error Message:", err.message);
        console.error("Error Stack:", err.stack || 'No stack available');
        console.error(`---------------------------------------------------------------`);
        next(err);
    } finally {
        client.release();
        console.log(`[submitQuiz] Client released for User ${userId}, Quiz ${quizIdNum}`);
    }
};

// get quiz result for a specific user
exports.getQuizResultForUser = async (req, res, next) => {
    const { quizId } = req.params;
    const userId = req.user.UserID;
    const quizIdNum = parseInt(quizId, 10);

    console.log(`[getQuizResultForUser] Attempting to fetch result for User ${userId}, Quiz ${quizIdNum}`);
    try {
        // fetch quiz details and user's resuls
        const resultQuery = `
            SELECT
                q."QuizID",
                q."Title",
                (SELECT COUNT(*) FROM "Question" WHERE "QuizID" = q."QuizID")::int AS "totalQuestions",
                t."MarksObtained",
                t."SubmissionTime"
            FROM "Quiz" q
            LEFT JOIN "Takes" t ON q."QuizID" = t."QuizID" AND t."UserID" = $2
            WHERE q."QuizID" = $1;
        `;
        const resultRes = await db.query(resultQuery, [quizIdNum, userId]);

        if (resultRes.rows.length === 0) {
             console.log(`[getQuizResultForUser] Quiz ${quizIdNum} not found.`);
             return res.status(404).json({ message: 'Quiz not found.' });
        }

        const quizData = resultRes.rows[0];
        const resultFound = quizData.MarksObtained !== null; // check if MarksObtained exists

        let questions = [];
        if (resultFound) {
            // when result was found, fetch associated questions and user answers
            console.log(`[getQuizResultForUser] Result found. Fetching questions and user answers for QuizID: ${quizIdNum}`);
            const questionsQuery = `
                SELECT q."QuestionID", q."Text", q."Options", q."CorrectAnswerIndex", ua."SubmittedAnswerIndex"
                FROM "Question" q
                LEFT JOIN "UserAnswers" ua ON q."QuestionID" = ua."QuestionID" AND ua."UserID" = $2 AND ua."QuizID" = $1
                WHERE q."QuizID" = $1
                ORDER BY q."QuestionID" ASC;
            `;
            const questionsResult = await db.query(questionsQuery, [quizIdNum, userId]);
            questions = questionsResult.rows;
            console.log(`[getQuizResultForUser] Questions query completed. Row count: ${questions.length}`);
        } else {
             // when result found, just fetch the questions for review
             console.log(`[getQuizResultForUser] No result found for User ${userId}, Quiz ${quizIdNum}. Fetching questions for review.`);
             const questionsQuery = `
                 SELECT "QuestionID", "Text", "Options", "CorrectAnswerIndex"
                 FROM "Question"
                 WHERE "QuizID" = $1
                 ORDER BY "QuestionID" ASC;
             `;
             const questionsResult = await db.query(questionsQuery, [quizIdNum]);
             questions = questionsResult.rows;
             console.log(`[getQuizResultForUser] Questions for review query completed. Row count: ${questions.length}`);
        }


        console.log(`[getQuizResultForUser] Sending success response. Result found: ${resultFound}`);
        res.status(200).json({
            status: 'success',
            data: {
                quizTitle: quizData.Title,
                totalQuestions: quizData.totalQuestions,
                resultFound: resultFound,
                score: resultFound ? quizData.MarksObtained : null,
                submissionTime: resultFound ? quizData.SubmissionTime : null,
                questions: questions
            }
        });

    } catch (err) {
         console.error(`--- ERROR in getQuizResultForUser for User ${userId}, Quiz ${quizIdNum} ---`);
         console.error("Error Message:", err.message);
         console.error("Error Stack:", err.stack || 'No stack available');
         console.error(`-------------------------------------------------------------------`);
         next(err);
     }
};
