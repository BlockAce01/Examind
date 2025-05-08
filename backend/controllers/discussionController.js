const db = require('../config/db');

//get all forum topics
exports.getAllForums = async (req, res, next) => {
    try {
        //join with user table 
        const query = `
            SELECT 
                "DiscussionForum".*,
                "User"."Name" AS "CreatorName",
                "User"."Role" AS "CreatorRole"
            FROM "DiscussionForum"
            INNER JOIN "User" ON "DiscussionForum"."CreatorUserID" = "User"."UserID"
            ORDER BY "LastActivity" DESC NULLS LAST
        `;
        const { rows } = await db.query(query);
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

//get single forum topic
exports.getForumById = async (req, res, next) => {
    const { forumId } = req.params;
    try {
        //join with the user table 
        const query = `
            SELECT 
                "DiscussionForum".*,
                "User"."Name" AS "CreatorName",
                "User"."Role" AS "CreatorRole"
            FROM "DiscussionForum"
            INNER JOIN "User" ON "DiscussionForum"."CreatorUserID" = "User"."UserID"
            WHERE "ForumID" = $1
        `;
        const values = [forumId];
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
        console.error(`Error fetching forum ${forumId}:`, err);
        next(err);
    }
};

//create new forum topic
exports.createForum = async (req, res, next) => {
    const { Topic, Description } = req.body;
    //get user ID 

    if (!Topic) {
        return res.status(400).json({ message: 'Missing required field: Topic' });
    }

    try {
        const creatorUserId = req.user?.UserID; //get user ID from auth middleware

        const query = `
            INSERT INTO "DiscussionForum" ("Topic", "Description", "LastActivity", "CreatorUserID")
            VALUES ($1, $2, NOW(), $3)
            RETURNING *;
        `;
        const values = [Topic, Description || null, creatorUserId];
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

//update forum topic
exports.updateForum = async (req, res, next) => {
    const { forumId } = req.params;
    const { Topic, Description } = req.body;

    if (!Topic && !Description) { 
        return res.status(400).json({ message: 'No update data provided (Topic or Description).' });
    }

    try {
        //fetch current data first 
        const query = `
            UPDATE "DiscussionForum"
            SET "Topic" = COALESCE($1, "Topic"),       -- Only update if value is provided
                "Description" = COALESCE($2, "Description")
            WHERE "ForumID" = $3
            RETURNING *;
        `;

        const values = [Topic, Description, forumId]; 
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

// delete forum topic
exports.deleteForum = async (req, res, next) => {
    const { forumId } = req.params;
    try {
        //add CASCADE or handle post deletion
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
