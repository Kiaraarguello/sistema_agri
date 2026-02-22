
import { query } from "./config/db";

async function main() {
    try {
        const res = await query(`
            SELECT id, fecha_presupuesto 
            FROM expediente 
            ORDER BY id DESC LIMIT 10
        `, []);
        console.log("LAST 10 EXPEDIENTES:", res.rows);
    } catch (e) {
        console.error(e);
    }
}
main();
