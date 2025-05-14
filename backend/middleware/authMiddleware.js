const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

//verify JWT
exports.protect = async (req, res, next) => {
    console.log('Executing protect middleware...');
    let token;

    //check for authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ status: 'fail', message: 'Not authorized, no token provided.' });
    }

    try {
        //verify 
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('FATAL ERROR: JWT_SECRET is not defined!');
            throw new Error('Server configuration error.');
        }
        const decoded = jwt.verify(token, secret);
        console.log('JWT decoded successfully. Decoded payload:', decoded);
        console.log('Querying database for user with ID:', decoded.userId); 

        //check user availability
        const currentUserQuery = await db.query('SELECT * FROM "User" WHERE "UserID" = $1', [decoded.userId]);
        console.log('Current user found:', currentUserQuery.rows[0]);
        const currentUser = currentUserQuery.rows[0];

        if (!currentUser) {
            return res.status(401).json({ status: 'fail', message: 'The user belonging to this token no longer exists.' });
        }

        //attach user to request object
        const { Password, ...userWithoutPassword } = currentUser;
        req.user = userWithoutPassword;
        console.log('User attached to request object:', req.user); 
        next(); //continue

    } catch (err) {
        console.error('Auth Middleware Error:', err.name, err.message);
        //handle specific JWT errors
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ status: 'fail', message: 'Invalid token. Please log in again.' });
        } else if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ status: 'fail', message: 'Your session has expired. Please log in again.' });
        }
        //handle other errors
        next(err);
    }
};

//allow access based on user roles
exports.restrictTo = (...roles) => {
    return (req, res, next) => {

        const userRole = req.user?.Role; //get user's role

        if (!userRole || !roles.includes(userRole)) {
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to perform this action.'
            });
        }
        next(); //user has permission and continue
    };
};
