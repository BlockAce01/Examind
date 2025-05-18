const db = require('../config/db');

//get comments for a speciifc forum
exports.getCommentsByForumId = async (req, res, next) => {
    const { forumId } = req.params;
    const userId = req.user?.UserID; // get current user ID

    try {
        const query = `
            SELECT 
                c."CommentID", 
                c."Content", 
                c."Date", 
                c."Upvotes", 
                c."UserID", 
                u."Name" AS "authorName", 
                u."Role" AS "authorRole",
                CASE WHEN cu."UserID" IS NOT NULL THEN TRUE ELSE FALSE END AS "hasUpvotedByUser"
            FROM "Comment" c
            JOIN "User" u ON c."UserID" = u."UserID"
            LEFT JOIN "CommentUpvotes" cu ON c."CommentID" = cu."CommentID" AND cu."UserID" = $2
            WHERE c."ForumID" = $1
            ORDER BY c."Date" ASC; -- Or DESC for newest first
        `;
        const values = [forumId, userId]; // forumId and userId as parameters
        const { rows } = await db.query(query, values);

        res.status(200).json({
            status: 'success',
            results: rows.length,
            data: {
                comments: rows,
            },
        });
    } catch (err) {
        console.error(`Error fetching comments for forum ${forumId}:`, err);
        next(err);
    }
};

// Handle comment upvote/unvote
exports.upvoteComment = async (req, res, next) => {
    const { commentId } = req.params;
    const userId = req.user?.UserID; // Get UserID from auth middleware

    if (!userId) {
        return res.status(401).json({ status: 'fail', message: 'User not authenticated.' });
    }

    try {
        // Check if the user has already upvoted this comment
        const existingUpvote = await db.query(
            'SELECT * FROM "CommentUpvotes" WHERE "CommentID" = $1 AND "UserID" = $2',
            [commentId, userId]
        );

        let newUpvoteCount;

        if (existingUpvote.rows.length > 0) {
            // user has already upvoted, then unvote
            await db.query(
                'DELETE FROM "CommentUpvotes" WHERE "CommentID" = $1 AND "UserID" = $2',
                [commentId, userId]
            );
            // decrement upvote count in Comment table
            const result = await db.query(
                'UPDATE "Comment" SET "Upvotes" = "Upvotes" - 1 WHERE "CommentID" = $1 RETURNING "Upvotes"',
                [commentId]
            );
            newUpvoteCount = result.rows[0].Upvotes;
            res.status(200).json({
                status: 'success',
                data: { upvotes: newUpvoteCount, action: 'unvoted' },
            });
        } else {
            // user has not upvoted, then upvote
            await db.query(
                'INSERT INTO "CommentUpvotes" ("CommentID", "UserID") VALUES ($1, $2)',
                [commentId, userId]
            );
            // increment upvote count in Comment table
            const result = await db.query(
                'UPDATE "Comment" SET "Upvotes" = "Upvotes" + 1 WHERE "CommentID" = $1 RETURNING "Upvotes"',
                [commentId]
            );
            newUpvoteCount = result.rows[0].Upvotes;
            res.status(200).json({
                status: 'success',
                data: { upvotes: newUpvoteCount, action: 'upvoted' },
            });
        }

    } catch (err) {
        console.error(`Error handling upvote/unvote for comment ${commentId} by user ${userId}:`, err);
        next(err);
    }
};


//create new comment
exports.createComment = async (req, res, next) => {
    const { forumId } = req.params;
    const { Content } = req.body; 
    const UserId = req.user?.UserID; //get UserID

    if (!Content) {
        return res.status(400).json({ message: 'Comment content cannot be empty.' });
    }

    try {
         //use transaction 
        const pool = db.pool; //get the pool object 
        const client = await pool.connect();

        try {
            await client.query('BEGIN'); //start transaction

            //insert new comment
            const insertCommentQuery = `
                INSERT INTO "Comment" ("ForumID", "UserID", "Content", "Date")
                VALUES ($1, $2, $3, NOW())
                RETURNING *;
            `;
            const commentResult = await client.query(insertCommentQuery, [forumId, UserId, Content]);
            const newComment = commentResult.rows[0];

             //update the discussionForum 
             const updateForumQuery = `
                 UPDATE "DiscussionForum"
                 SET "PostCount" = "PostCount" + 1,
                     "LastActivity" = NOW()
                 WHERE "ForumID" = $1;
             `;
             await client.query(updateForumQuery, [forumId]);

             await client.query('COMMIT'); //commit transaction

            //fetch author name & role 
            const authorQuery = 'SELECT "Name", "Role" FROM "User" WHERE "UserID" = $1';
            const authorResult = await client.query(authorQuery, [newComment.UserID]);
            const author = authorResult.rows[0];

            newComment.authorName = author?.Name || 'Unknown User';
            newComment.authorRole = author?.Role || 'student'; 

            res.status(201).json({
                status: 'success',
                data: {
                    comment: newComment,
                },
            });

        } catch (err) {
             await client.query('ROLLBACK'); //rollback transaction 
             throw err; //re-throw error 
         } finally {
             client.release(); //release client back to the pool
         }

    } catch (err) {
        console.error(`Error creating comment in forum ${forumId}:`, err);
        next(err);
    }
};
