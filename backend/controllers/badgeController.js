const db = require('../config/db');

const awardBadge = async (userId, badgeId) => {
    try {
        // check if the user already has the badge
        const existingBadgeQuery = 'SELECT * FROM "UserBadge" WHERE "UserID" = $1 AND "BadgeID" = $2';
        const existingBadge = await db.query(existingBadgeQuery, [userId, badgeId]);

        if (existingBadge.rows.length === 0) {
            // award the badge
            const awardQuery = 'INSERT INTO "UserBadge" ("UserID", "BadgeID") VALUES ($1, $2)';
            await db.query(awardQuery, [userId, badgeId]);
            console.log(`Badge ${badgeId} awarded to user ${userId}`);
        }
    } catch (error) {
        console.error(`Error awarding badge ${badgeId} to user ${userId}:`, error);
    }
};

exports.checkAndAwardBadges = async (req, res, next) => {
    const { userId } = req.params;

    try {
        // --- Quiz Master Badges ---
        const quizQuery = 'SELECT COUNT(*) FROM "Takes" WHERE "UserID" = $1';
        const quizResult = await db.query(quizQuery, [userId]);
        const quizzesCompleted = parseInt(quizResult.rows[0].count, 10);

        if (quizzesCompleted >= 6) {
            await awardBadge(userId, 3); // Gold
        } else if (quizzesCompleted >= 4) {
            await awardBadge(userId, 2); // Silver
        } else if (quizzesCompleted >= 2) {
            await awardBadge(userId, 1); // Bronze
        }

        // --- Point Collector Badges ---
        const pointsQuery = 'SELECT "Points" FROM "User" WHERE "UserID" = $1';
        const pointsResult = await db.query(pointsQuery, [userId]);
        const points = pointsResult.rows[0].Points;

        if (points >= 100) {
            await awardBadge(userId, 6); // Gold
        } else if (points >= 50) {
            await awardBadge(userId, 5); // Silver
        } else if (points >= 10) {
            await awardBadge(userId, 4); // Bronze
        }

        // --- Discussion Starter Badges ---
        const discussionQuery = 'SELECT COUNT(*) FROM "DiscussionForum" WHERE "CreatorUserID" = $1';
        const discussionResult = await db.query(discussionQuery, [userId]);
        const discussionsStarted = parseInt(discussionResult.rows[0].count, 10);

        if (discussionsStarted >= 5) {
            await awardBadge(userId, 8); // Silver
        } else if (discussionsStarted >= 1) {
            await awardBadge(userId, 7); // Bronze
        }
        
        // --- Comment Upvoter Badge ---
        const upvoteQuery = 'SELECT SUM("Upvotes") as total_upvotes FROM "Comment" WHERE "UserID" = $1';
        const upvoteResult = await db.query(upvoteQuery, [userId]);
        const totalUpvotes = parseInt(upvoteResult.rows[0].total_upvotes, 10) || 0;

        if (totalUpvotes >= 5) {
            await awardBadge(userId, 9); // Gold
        }

        res.status(200).json({ message: 'Badge check completed.' });
    } catch (error) {
        next(error);
    }
};
