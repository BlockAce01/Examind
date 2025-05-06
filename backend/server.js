require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const app = express();
const PORT = process.env.PORT || 3001;

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
//user routes(for admin)



// routes for Testing
app.get('/', (req, res) => {
  res.send('Examind Backend API is running!');
});

//   error handling middleware
//catch-all for 404 Not Found errors
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
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