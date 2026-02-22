const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL.split('?')[0],
});

async function run() {
    await client.connect();
    const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'expediente'");
    console.log(res.rows.map(r => r.column_name));
    await client.end();
}
run();
