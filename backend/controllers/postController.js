const db = require('../config/db');

//get posts for a speciifc forum
exports.getPostsByForumId = async (req, res, next) => {
    const { forumId } = req.params;
    try {
        const query = `
            SELECT p."PostID", p."Content", p."Date", p."Upvotes", p."UserID", u."Name" AS "authorName", u."Role" AS "authorRole"
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

//upvote post
exports.upvotePost = async (req, res, next) => {
    const { postId, forumId } = req.params;
    const UserId = req.user?.UserID; //get UserID 

    try {
 const query = `
            UPDATE "Post"
            SET "Upvotes" = "Upvotes" + 1
            WHERE "PostID" = $1
            RETURNING "Upvotes";
        `;
        try {
            const result = await db.query(query, [postId]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Post not found',
                });
            }

            res.status(200).json({
                status: 'success',
                data: {
                    upvotes: result.rows[0].Upvotes,
                },
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to update upvotes',
            });
        }
    } catch (err) {
        console.error(`Error upvoting post ${postId}:`, err);
        next(err);
    }
};


//create new post
exports.createPost = async (req, res, next) => {
    const { forumId } = req.params;
    const { Content } = req.body; 
    const UserId = req.user?.UserID; //get UserID

    if (!Content) {
        return res.status(400).json({ message: 'Post content cannot be empty.' });
    }

    try {
         //use transaction 
        const pool = db.pool; //get the pool object 
        const client = await pool.connect();

        try {
            await client.query('BEGIN'); //start transaction

            //insert new post
            const insertPostQuery = `
                INSERT INTO "Post" ("ForumID", "UserID", "Content", "Date")
                VALUES ($1, $2, $3, NOW())
                RETURNING *;
            `;
            const postResult = await client.query(insertPostQuery, [forumId, UserId, Content]);
            const newPost = postResult.rows[0];

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
            const authorResult = await client.query(authorQuery, [newPost.UserID]);
            const author = authorResult.rows[0];

            newPost.authorName = author?.Name || 'Unknown User';
            newPost.authorRole = author?.Role || 'student'; 

            res.status(201).json({
                status: 'success',
                data: {
                    post: newPost,
                },
            });

        } catch (err) {
             await client.query('ROLLBACK'); //rollback transaction 
             throw err; //re-throw error 
         } finally {
             client.release(); //release client back to the pool
         }

    } catch (err) {
        console.error(`Error creating post in forum ${forumId}:`, err);
        next(err);
    }
};
