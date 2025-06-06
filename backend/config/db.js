const { Pool } = require('pg');
require('dotenv').config(); 

//new pool instance using env variables
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
});

//test the connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
        release(); //release the client back to the pool
        if (err) {
            return console.error('Error executing query', err.stack);
        }
        console.log('Successfully connected to PostgreSQL database!');
    });
});

//export the pool's query method
module.exports = {
    query: (text, params) => pool.query(text, params),
    pool: pool //export the pool itself when: transactions etc.
};