
import { query } from "./config/db";

async function main() {
    const res = await query("SELECT MAX(id) as max_id FROM clientes", []);
    console.log("Max client ID:", res.rows[0].max_id);

    const res2 = await query("SELECT id, nombre_completo FROM clientes ORDER BY id DESC LIMIT 5", []);
    console.log("Last 5 clients:", res2.rows);
}
main();
