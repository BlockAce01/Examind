// examind-backend/controllers/authController.js
const db = require('../config/db'); // Our database query function
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // To access JWT_SECRET

const SALT_ROUNDS = 10; // Cost factor for bcrypt hashing

// --- Registration Controller ---
// ... (Keep registration code as is) ...
exports.register = async (req, res, next) => {
    // ... registration logic ...
};

// --- Login Controller ---
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        const result = await db.query('SELECT * FROM "User" WHERE "Email" = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.Password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const payload = {
            userId: user.UserID,
            role: user.Role, // Using DB casing 'Role' here for payload
        };

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('FATAL ERROR: JWT_SECRET is not defined!'); // Log critical error
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const token = jwt.sign(
            payload,
            secret,
            { expiresIn: '1d' }
        );

        // --- DEBUGGING START ---
        // Construct the object EXACTLY as it will be sent
        const userResponseObject = {
            userId: user.UserID,        // lowercase key
            name: user.Name,            // lowercase key
            email: user.Email,          // lowercase key
            role: user.Role,            // lowercase key, VALUE is from DB (e.g., 'admin')
            subscriptionStatus: user.SubscriptionStatus, // Added missing field, adjust casing if needed
            // Add other fields if your frontend User type expects them (e.g., points, badges)
            // points: user.Points,
            // badges: user.Badges,
        };
        console.log('--- Backend Login Response ---');
        console.log(`User Data from DB used for response: Role='${user.Role}', UserID=${user.UserID}`); // Log DB value directly
        console.log('User Object Sent to Frontend:', JSON.stringify(userResponseObject, null, 2));
        // --- DEBUGGING END ---

        res.status(200).json({
            message: 'Login successful!',
            token: token,
            user: userResponseObject // Send the constructed object
        });

    } catch (err) {
        console.error('Login Error:', err.stack || err); // Log full stack
        next(err);
    }
};