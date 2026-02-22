import { query } from './src/db';
import fs from 'fs';

async function check() {
    try {
        const res = await query("DESCRIBE expediente");
        fs.writeFileSync('expediente_structure.json', JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}
check();
