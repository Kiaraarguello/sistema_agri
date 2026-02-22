
import { query } from "./config/db";

async function main() {
    const res = await query("DESCRIBE expediente_presupuesto", []);
    console.log("Columns of expediente_presupuesto:", res.rows);

    const res2 = await query("DESCRIBE expediente_cuotas", []);
    console.log("Columns of expediente_cuotas:", res2.rows);
}
main();
