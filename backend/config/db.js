// backend/config/db.js
const { Pool } = require('pg');
require('dotenv').config(); // Ensure environment variables are loaded

// Create a new pool instance using environment variables
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10), // Ensure port is an integer
    // Optional: Add SSL configuration if required by your cloud provider
    // ssl: {
    //   rejectUnauthorized: false // Adjust based on provider requirements
    // }
});

// Test the connection (optional, but recommended)
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
        release(); // Release the client back to the pool
        if (err) {
            return console.error('Error executing query', err.stack);
        }
        console.log('Successfully connected to PostgreSQL database!');
        // console.log('Current time from DB:', result.rows[0].now);
    });
});

// Export the pool's query method to be used elsewhere
module.exports = {
    query: (text, params) => pool.query(text, params),
    pool: pool // Export the pool itself if needed for transactions etc.
};