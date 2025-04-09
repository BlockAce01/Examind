// backend/controllers/authController.js
const db = require('../config/db'); // Our database query function
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // To access JWT_SECRET

const SALT_ROUNDS = 10; // Cost factor for bcrypt hashing

// --- Registration Controller ---
exports.register = async (req, res, next) => {
    // 1. Extract data from request body
    const { name, email, password, role } = req.body;

    // 2. Basic Input Validation
    if (!name || !email || !password || !role) {
        // Using return here sends response and stops execution
        return res.status(400).json({ message: 'Please provide name, email, password, and role' });
    }

    // Check if role is valid
    if (role !== 'student' && role !== 'teacher') {
         return res.status(400).json({ message: 'Invalid role specified. Must be student or teacher.' });
    }

    try {
        // 3. Check if user already exists
        // Ensure correct casing for "User" and "Email" if using quotes
        const userExists = await db.query('SELECT * FROM "User" WHERE "Email" = $1', [email]);

        if (userExists.rows.length > 0) {
            return res.status(409).json({ message: 'Email already in use' }); // 409 Conflict
        }

        // 4. Hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // 5. Insert new user into database
        // Ensure column names match schema ("Name", "Email", "Password", etc.)
        const newUserQuery = `
            INSERT INTO "User" ("Name", "Email", "Password", "Points", "Badges", "SubscriptionStatus", "Role")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING "UserID", "Name", "Email", "Role", "SubscriptionStatus";
        `;
        // Make sure order of values matches columns
        const values = [name, email, hashedPassword, 0, null, 'free', role];

        const result = await db.query(newUserQuery, values);
        const newUser = result.rows[0];

        // 6. Send success response (don't send password back)
        res.status(201).json({
            message: 'User registered successfully!',
            user: newUser
        });

    } catch (err) {
        console.error('Registration Error:', err.stack || err); // Log full error
        // Pass error to the global error handler in server.js
        next(err);
    }
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