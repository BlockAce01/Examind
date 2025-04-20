//backend/controllers/discussionController.js
const db = require('../config/db');

// Get All Forum Topics
exports.getAllForums = async (req, res, next) => {
    try {
        // Ensure column names ("ForumID", "Topic", "LastActivity", etc.) match schema
        const query = 'SELECT * FROM "DiscussionForum" ORDER BY "LastActivity" DESC NULLS LAST';
        const {rows} = await db.query(query);
        res.status(200).json({
            status: 'success',
            results: rows.length,
            data: {
                forums: rows,
            },
        });
    } catch (err) {
        console.error('Error fetching forums:', err);
        next(err);
    }
};

// Get Single Forum Topic by ID
exports.getForumById = async (req, res, next) => {
    const { forumId } = req.params;
    try {
        const query = 'SELECT * FROM "DiscussionForum" WHERE "ForumID" = $1';
        const { rows } = await db.query(query, [forumId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Forum topic not found' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                forum: rows[0],
            },
        });
    } catch (err) {
        console.error(`Error fetching forum ${forumId}:`, err);
        next(err);
    }
};

// Create New Forum Topic
exports.createForum = async (req, res, next) => {
    // Ensure request body keys match database columns exactly
    const { Topic, Description } = req.body;
    // const creatorUserId = req.user?.userId; // Get user ID from auth middleware later

    if (!Topic) {
        return res.status(400).json({ message: 'Missing required field: Topic' });
    }

    try {
        // PostCount defaults to 0, LastActivity can be null initially or set to NOW()
        const query = `
            INSERT INTO "DiscussionForum" ("Topic", "Description", "LastActivity")
            VALUES ($1, $2, NOW())
            RETURNING *;
        `;
        // TODO: Add CreatorUserID when auth is implemented: VALUES ($1, $2, NOW(), $3) [Topic, Description, creatorUserId]
        const values = [Topic, Description || null];
        const { rows } = await db.query(query, values);

        res.status(201).json({
            status: 'success',
            data: {
                forum: rows[0],
            },
        });
    } catch (err) {
        console.error('Error creating forum topic:', err);
        next(err);
    }
};

// Update Forum Topic
exports.updateForum = async (req, res, next) => {
    const { forumId } = req.params;
    const { Topic, Description } = req.body;

    if (!Topic && !Description) { // Must provide at least one field to update
        return res.status(400).json({ message: 'No update data provided (Topic or Description).' });
    }

    try {
        // Fetch current data first for robustness (optional for this example)
        const query = `
            UPDATE "DiscussionForum"
            SET "Topic" = COALESCE($1, "Topic"),       -- Only update if value is provided
                "Description" = COALESCE($2, "Description")
            WHERE "ForumID" = $3
            RETURNING *;
        `;
        const values = [Topic, Description, forumId]; // Pass undefined/null for fields not updated

        const { rows } = await db.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Forum topic not found' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                forum: rows[0],
            },
        });
    } catch (err) {
        console.error(`Error updating forum ${forumId}:`, err);
        next(err);
    }
};

// Delete Forum Topic
exports.deleteForum = async (req, res, next) => {
    const { forumId } = req.params;
    try {
        // Note: This does not delete associated posts based on current schema (posts will be orphaned)
        // Consider adding a CASCADE constraint or handling post deletion separately if needed.
        const query = 'DELETE FROM "DiscussionForum" WHERE "ForumID" = $1 RETURNING *;';
        const { rows } = await db.query(query, [forumId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Forum topic not found' });
        }

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        console.error(`Error deleting forum ${forumId}:`, err);
        next(err);
    }
};