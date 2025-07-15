const db = require('../config/db');

// Middleware to get current user's ID from the request object
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

// get the current user's profile
exports.getUserProfile = async (req, res, next) => {
    try {
        const query = 'SELECT "UserID", "Name", "Email", "Role", "SubscriptionStatus", "Points" FROM "User" WHERE "UserID" = $1';
        const { rows } = await db.query(query, [req.user.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            status: 'success',
            data: { user: rows[0] },
        });
    } catch (err) {
        next(err);
    }
};

exports.getRecentActivity = async (req, res, next) => {
    const { id } = req.params;
    try {
        const quizQuery = `
            SELECT 'quiz' as type, q."Title" as title, t."SubmissionTime" as "timestamp"
            FROM "Takes" t
            JOIN "Quiz" q ON t."QuizID" = q."QuizID"
            WHERE t."UserID" = $1
            ORDER BY t."SubmissionTime" DESC
            LIMIT 5;
        `;
        const quizResult = await db.query(quizQuery, [id]);

        const discussionQuery = `
            SELECT 'discussion' as type, d."Topic" as title, d."LastActivity" as "timestamp"
            FROM "DiscussionForum" d
            WHERE d."CreatorUserID" = $1
            ORDER BY d."LastActivity" DESC
            LIMIT 5;
        `;
        const discussionResult = await db.query(discussionQuery, [id]);

        const activities = [...quizResult.rows, ...discussionResult.rows];
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        res.status(200).json({
            status: 'success',
            data: {
                activities: activities.slice(0, 3),
            },
        });
    } catch (err) {
        next(err);
    }
};

// get user stats (points, badges, quizzes completed)
exports.getUserStats = async (req, res, next) => {
    const { id } = req.params;
    try {
        // fetch points from the User table
        const pointsQuery = 'SELECT "Points" FROM "User" WHERE "UserID" = $1';
        const pointsResult = await db.query(pointsQuery, [id]);
        const points = pointsResult.rows.length > 0 ? pointsResult.rows[0].Points : 0;

        // fetch quizzes completed count from the "Takes" table
        const quizzesQuery = 'SELECT COUNT(*) FROM "Takes" WHERE "UserID" = $1';
        const quizzesResult = await db.query(quizzesQuery, [id]);
        const quizzesCompleted = parseInt(quizzesResult.rows[0].count, 10);

        // fetch badges count from the "UserBadge" table
        const badgesQuery = 'SELECT COUNT(*) FROM "UserBadge" WHERE "UserID" = $1';
        const badgesResult = await db.query(badgesQuery, [id]);
        const badges = parseInt(badgesResult.rows[0].count, 10);

        res.status(200).json({
            status: 'success',
            data: {
                points,
                badges,
                quizzesCompleted,
            },
        });
    } catch (err) {
        next(err);
    }
};

exports.getUserBadges = async (req, res, next) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT b.*
            FROM "Badge" b
            JOIN "UserBadge" ub ON b."BadgeID" = ub."BadgeID"
            WHERE ub."UserID" = $1;
        `;
        const { rows } = await db.query(query, [id]);
        res.status(200).json({
            status: 'success',
            data: rows,
        });
    } catch (err) {
        next(err);
    }
};


// get All Users (admin)
exports.getAllUsers = async (req, res, next) => {
    try {
        // select relevant non-sensitive fields
        const query = 'SELECT "UserID", "Name", "Email", "Role", "SubscriptionStatus", "Points" FROM "User" ORDER BY "UserID" ASC';
        const { rows } = await db.query(query);
        res.status(200).json({
            status: 'success',
            results: rows.length,
            data: { users: rows },
        });
    } catch (err) {
        next(err);
    }
};

// get Single User (admin)
exports.getUserById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const query = 'SELECT "UserID", "Name", "Email", "Role", "SubscriptionStatus", "Points" FROM "User" WHERE "UserID" = $1';
        const { rows } = await db.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            status: 'success',
            data: { user: rows[0] },
        });
    } catch (err) {
        next(err);
    }
};

// Update User
exports.updateUser = async (req, res, next) => {
    const { id } = req.params;
    // Do NOT allow changing email/password directly here without extra security
    const { Role, SubscriptionStatus } = req.body; // Expect uppercase keys matching DB

    // Validate input (Role must be valid, etc.)
    const validRoles = ['student', 'teacher', 'admin'];
     const validStatuses = ['free', 'premium', 'pending', 'cancelled'];

    if (Role && !validRoles.includes(Role)) {
         return res.status(400).json({ message: 'Invalid Role specified.'});
    }
     if (SubscriptionStatus && !validStatuses.includes(SubscriptionStatus)) {
         return res.status(400).json({ message: 'Invalid SubscriptionStatus specified.'});
     }

    if (!Role && !SubscriptionStatus) {
        return res.status(400).json({ message: 'No update data provided (Role or SubscriptionStatus).' });
    }

    try {
        const query = `
            UPDATE "User"
            SET "Role" = COALESCE($1, "Role"),
                "SubscriptionStatus" = COALESCE($2, "SubscriptionStatus")
                -- Add other updatable fields here if needed (e.g., "Name")
            WHERE "UserID" = $3
            RETURNING "UserID", "Name", "Email", "Role", "SubscriptionStatus"; -- Return updated non-sensitive info
        `;
        const values = [Role, SubscriptionStatus, id];

        const { rows } = await db.query(query, values);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            status: 'success',
            data: { user: rows[0] },
        });
    } catch (err) {
        next(err);
    }
};

// Delete User (admin) - Use with extreme caution!
exports.deleteUser = async (req, res, next) => {
    const { id } = req.params;
    // Add checks: prevent deleting own account? prevent deleting last admin?
    try {
        const query = 'DELETE FROM "User" WHERE "UserID" = $1 RETURNING *;';
        const { rows } = await db.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        next(err);
    }
};

// get ranked users for leaderboard
exports.getRankedUsers = async (req, res, next) => {
    try {
        const query = 'SELECT "UserID", "Name", "Points" FROM "User" WHERE "Role" = \'student\' ORDER BY "Points" DESC';
        const { rows } = await db.query(query);
        res.status(200).json({
            status: 'success',
            results: rows.length,
            data: { users: rows },
        });
    } catch (err) {
        next(err);
    }
};
