const db = require('../config/db');

//get quiz statistics
exports.getQuizStats = async (req, res) => {
    try {
        const subjectStats = await db.query(`
            SELECT "Subject", COUNT(*) as count FROM "Quiz" GROUP BY "Subject"
        `);
        const difficultyStats = await db.query(`
            SELECT "DifficultyLevel", COUNT(*) as count FROM "Quiz" GROUP BY "DifficultyLevel"
        `);

        console.log('Quiz Stats - Subject:', JSON.stringify(subjectStats, null, 2));
        console.log('Quiz Stats - Difficulty:', JSON.stringify(difficultyStats, null, 2));

        res.status(200).json({
            status: 'success',
            data: {
                subjectStats: subjectStats.rows || [],
                difficultyStats: difficultyStats.rows || [],
            },
        });
    } catch (error) {
        console.error('Error fetching quiz stats:', error);
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};

//get resource statistics
exports.getResourceStats = async (req, res) => {
    try {
        const resourceTypeStats = await db.query(`
            SELECT "Type", COUNT(*) as count FROM "Resource" GROUP BY "Type"
        `);

        console.log('Resource Stats:', JSON.stringify(resourceTypeStats, null, 2));

        res.status(200).json({
            status: 'success',
            data: {
                resourceTypeStats: resourceTypeStats.rows || [],
            },
        });
    } catch (error) {
        console.error('Error fetching resource stats:', error);
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};

//get discussion statistics
exports.getDiscussionStats = async (req, res) => {
    try {
        const discussionStats = await db.query(`
            SELECT u."Name", COUNT(d."ForumID") as postCount 
            FROM "User" u 
            JOIN "DiscussionForum" d ON u."UserID" = d."CreatorUserID" 
            GROUP BY u."UserID"
        `);

        console.log('Discussion Stats:', JSON.stringify(discussionStats, null, 2));

        res.status(200).json({
            status: 'success',
            data: {
                discussionStats: discussionStats.rows || [],
            },
        });
    } catch (error) {
        console.error('Error fetching discussion stats:', error);
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};
