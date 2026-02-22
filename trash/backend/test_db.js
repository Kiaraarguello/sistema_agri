const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL.split('?')[0],
});

async function test() {
    try {
        await client.connect();
        console.log('CONNECTED_TO_DB');
        const res = await client.query('SELECT * FROM expediente LIMIT 1');
        console.log('SAMPLE_ROW:', JSON.stringify(res.rows[0], null, 2));
        await client.end();
    } catch (err) {
        console.error('DB_ERROR:', err);
        process.exit(1);
    }
}
test();
