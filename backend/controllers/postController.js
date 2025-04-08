// backend/controllers/postController.js
const db = require('../config/db');

// Get Posts for a Specific Forum
exports.getPostsByForumId = async (req, res, next) => {
    const { forumId } = req.params;
    try {
        // Fetch posts and join with User table to get author name
        // Ensure column names ("PostID", "Content", "Date", "Upvotes", "UserID", "Name") are correct
        // Note: Requires a "Post" table with "ForumID", "UserID", "Content", "Date", "Upvotes" columns
        // You'll need to create this table based on your mock data structure if it doesn't exist.
        // CREATE TABLE "Post" ( "PostID" SERIAL PRIMARY KEY, "ForumID" INT REFERENCES "DiscussionForum"("ForumID") ON DELETE CASCADE, "UserID" INT REFERENCES "User"("UserID"), "Content" TEXT NOT NULL, "Date" TIMESTAMPTZ DEFAULT NOW(), "Upvotes" INT DEFAULT 0 );
        const query = `
            SELECT p."PostID", p."Content", p."Date", p."Upvotes", p."UserID", u."Name" AS "authorName"
            FROM "Post" p
            JOIN "User" u ON p."UserID" = u."UserID"
            WHERE p."ForumID" = $1
            ORDER BY p."Date" ASC; -- Or DESC for newest first
        `;
        const { rows } = await db.query(query, [forumId]);

        res.status(200).json({
            status: 'success',
            results: rows.length,
            data: {
                posts: rows,
            },
        });
    } catch (err) {
        console.error(`Error fetching posts for forum ${forumId}:`, err);
        next(err);
    }
};

// Create New Post
exports.createPost = async (req, res, next) => {
    const { forumId } = req.params;
    const { Content } = req.body; // Content comes from request body
    const UserId = 1; // TODO: Replace with req.user.userId from auth middleware

    if (!Content) {
        return res.status(400).json({ message: 'Post content cannot be empty.' });
    }

    try {
         // Use a transaction to insert post and update forum's LastActivity/PostCount
        const pool = db.pool; // Get the pool object from db config
        const client = await pool.connect();

        try {
            await client.query('BEGIN'); // Start transaction

            // Insert the new post
            const insertPostQuery = `
                INSERT INTO "Post" ("ForumID", "UserID", "Content", "Date")
                VALUES ($1, $2, $3, NOW())
                RETURNING *;
            `;
            const postResult = await client.query(insertPostQuery, [forumId, UserId, Content]);
            const newPost = postResult.rows[0];

             // Update the DiscussionForum table's PostCount and LastActivity
             const updateForumQuery = `
                 UPDATE "DiscussionForum"
                 SET "PostCount" = "PostCount" + 1,
                     "LastActivity" = NOW()
                 WHERE "ForumID" = $1;
             `;
             await client.query(updateForumQuery, [forumId]);

             await client.query('COMMIT'); // Commit transaction

            // Fetch author name to include in the response (optional, but good UX)
            const authorQuery = 'SELECT "Name" FROM "User" WHERE "UserID" = $1';
            const authorResult = await client.query(authorQuery, [newPost.UserID]);
            newPost.authorName = authorResult.rows[0]?.Name || 'Unknown User';


            res.status(201).json({
                status: 'success',
                data: {
                    post: newPost,
                },
            });

        } catch (err) {
             await client.query('ROLLBACK'); // Rollback transaction on error
             throw err; // Re-throw error to be caught by outer catch block
         } finally {
             client.release(); // Release client back to the pool
         }

    } catch (err) {
        console.error(`Error creating post in forum ${forumId}:`, err);
        next(err);
    }
};