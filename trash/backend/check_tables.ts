import { query } from './src/db';

async function check() {
    const res = await query("SHOW TABLES");
    console.log(res.rows);
}
check();
