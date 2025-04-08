// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Import the database configuration

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
// Enable CORS for all routes (adjust origins in production)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Basic request logger (optional, can be expanded)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// --- API Routes ---
// Define a base route for all API endpoints
//  Authentication routes
app.use('/api/v1/auth', require('./routes/authRoutes')); // We'll create these files later
//  Quiz routes
app.use('/api/v1/quizzes', require('./routes/quizRoutes'));
//  Resource routes
app.use('/api/v1/resources', require('./routes/resourceRoutes'));
// Example: Discussion routes
app.use('/api/v1/discussions', require('./routes/discussionRoutes'));
// Example: User routes (for admin)
app.use('/api/v1/users', require('./routes/userRoutes'));


// --- Basic Routes for Testing ---
app.get('/', (req, res) => {
  res.send('Examind Backend API is running!');
});

// Simple DB connection test route (optional)
app.get('/db-test', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ message: 'Database connection successful!', time: result.rows[0].now });
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// --- Error Handling Middleware (Basic) ---
// Catch-all for 404 Not Found errors
app.use((req, res, next) => {
    res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// General error handler (should be last middleware)
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        // Optionally include stack trace in development
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  // The database connection message from db.js should appear shortly after this
});