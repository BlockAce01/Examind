require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const app = express();
const PORT = process.env.PORT || 8080;

//     middleware
//enable CORS for all routes
app.use(cors());

//parse JSON request bodies
app.use(express.json());

//basic request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

//    API Routes
//authentication routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
//quiz routes
app.use('/api/v1/quizzes', require('./routes/quizRoutes'));
//resource routes
app.use('/api/v1/resources', require('./routes/resourceRoutes'));
//discussion routes
app.use('/api/v1/discussions', require('./routes/discussionRoutes'));
//user routes(admin)
app.use('/api/v1/users', require('./routes/userRoutes'));
//badge routes
app.use('/api/v1/badges', require('./routes/badgeRoutes'));
// AI Chat routes
app.use('/api/v1/ai-chat', require('./routes/aiChatRoutes'));
//stats routes
app.use('/api/v1/stats', require('./routes/statsRoutes'));
//subject routes
app.use('/api/v1/subjects', require('./routes/subjectRoutes'));



// routes for testing
app.get('/', (req, res) => {
  res.send('Examind Backend API is running!');
});

// Health check endpoint for CI/CD
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is healthy' });
});

//   error handling middleware
//catch-all for 404 Not Found errors
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found: ${req.originalUrl}' });
});

//general error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

//   start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
