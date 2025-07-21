const { Pool } = require('pg');
require('dotenv').config(); 

//new pool instance using env variables
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    //ssl: {rejectUnauthorized: false}
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
    query: async (text, params) => {
        const client = await pool.connect();
        try {
            const res = await client.query(text, params);
            return res;
        } finally {
            client.release();
        }
    },
    pool: pool //export the pool itself when: transactions etc.
};
