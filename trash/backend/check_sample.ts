import { query } from './src/db';

async function check() {
    try {
        const res = await query("SELECT * FROM expediente LIMIT 1");
        console.log(JSON.stringify(res.rows[0], null, 2));
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}
check();
