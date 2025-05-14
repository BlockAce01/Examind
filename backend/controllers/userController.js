const db = require('../config/db');

// Get All Users (admin)
exports.getAllUsers = async (req, res, next) => {
    try {
        // Select relevant non-sensitive fields
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

// Get Single User (admin)
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

// Update User (admin - e.g., role, status)
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
