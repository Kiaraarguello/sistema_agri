import { query } from './src/db';

async function check() {
    try {
        console.log("Checking columns for 'expediente'...");
        const res = await query("DESCRIBE expediente");
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}
check();
