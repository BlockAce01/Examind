const db = require('../config/db'); //connect to database
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); //load environment variables

const SALT_ROUNDS = 10; //sets the level of security

//register a new user
exports.register = async (req, res, next) => {
    const { name, email, password, role, subjects } = req.body;

    //input validation
    if (!name || !email || !password || !role || !subjects) {
        return res.status(400).json({ message: 'Please provide name, email, password, role and subjects' });
    }

    if (role === 'student' && (!Array.isArray(subjects) || subjects.length !== 3)) {
        return res.status(400).json({ message: 'Students must select exactly 3 subjects' });
    }

    if (role === 'teacher' && (!Array.isArray(subjects) || subjects.length !== 1)) {
        return res.status(400).json({ message: 'Teachers must select exactly 1 subject' });
    }

    //check the role validation
    if (role !== 'student' && role !== 'teacher') {
         return res.status(400).json({ message: 'Invalid role specified. Must be student or teacher.' });
    }

    try {
        //check the user availability
        const userExists = await db.query('SELECT * FROM "User" WHERE "Email" = $1', [email]);

        if (userExists.rows.length > 0) {
            return res.status(409).json({ message: 'Email already in use' }); // 409 Conflict
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        //insert new user into database
        const newUserQuery = `
            INSERT INTO "User" ("Name", "Email", "Password", "Points", "Badges", "SubscriptionStatus", "Role")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING "UserID", "Name", "Email", "Role", "SubscriptionStatus";
        `;
        //match order of values and columns
        const values = [name, email, hashedPassword, 0, null, 'free', role];

        const result = await db.query(newUserQuery, values);
        const newUser = result.rows[0];

        if (role === 'student') {
            const studentSubjectQuery = 'INSERT INTO "StudentSubject" ("UserID", "SubjectID") VALUES ($1, $2)';
            for (const subjectId of subjects) {
                await db.query(studentSubjectQuery, [newUser.UserID, subjectId]);
            }
        } else if (role === 'teacher') {
            const teacherSubjectQuery = 'INSERT INTO "TeacherSubject" ("UserID", "SubjectID") VALUES ($1, $2)';
            await db.query(teacherSubjectQuery, [newUser.UserID, subjects[0]]);
        }

        //send success message
        res.status(201).json({
            message: 'User registered successfully!',
            user: newUser
        });

    } catch (err) {
        console.error('Registration Error:', err.stack || err); 
        //pass error
        next(err);
    }
};

//login Controller 
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

        //keep the user logging in
        const payload = {
            userId: user.UserID,
            role: user.Role, 
        };

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('FATAL ERROR: JWT_SECRET is not defined!'); 
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const token = jwt.sign(
            payload,
            secret,
            { expiresIn: '1d' }
        );

        //debugging
        //preapare user infomation to send back
        const userResponseObject = {
            userId: user.UserID,        
            name: user.Name,            
            email: user.Email,          
            role: user.Role,          
            subscriptionStatus: user.SubscriptionStatus, 
            //add more fields
        };

        //print debug infomation 
        console.log('--- Backend Login Response ---');
        console.log(`User Data from DB used for response: Role='${user.Role}', UserID=${user.UserID}`); 
        console.log('User Object Sent to Frontend:', JSON.stringify(userResponseObject, null, 2));
        

        res.status(200).json({
            message: 'Login successful!',
            token: token,
            user: userResponseObject 
                });

    } catch (err) {
        console.error('Login Error:', err.stack || err); 
        //pass error
        next(err);
    }
};
