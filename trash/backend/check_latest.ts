
import { query } from './src/db';

async function main() {
    try {
        console.log("Fetching last 5 expedientes...");
        const result = await query(`
            SELECT e.id, e.cliente_id, et.pdf_ploteo, et.cert_catastral 
            FROM expediente e
            LEFT JOIN expediente_terreno et ON e.id = et.expediente_id
            ORDER BY e.id DESC 
            LIMIT 5
        `);
        console.table(result.rows);
    } catch (error) {
        console.error("Error:", error);
    }
    process.exit(0);
}

main();
