
import { query } from "./config/db";

async function main() {
    const range = { min: 1156, max: 1175 };
    console.log(`Checking leftovers for ID range [${range.min} - ${range.max}]...`);

    const tables = ["expediente_cuotas", "expediente_presupuesto_items", "expediente_presupuesto", "expediente_firmante", "terreno", "expediente", "clientes"];

    for (const table of tables) {
        try {
            let q = "";
            if (table === "clientes") q = `SELECT count(*) as c FROM ${table} WHERE id BETWEEN ? AND ?`;
            else if (table === "expediente") q = `SELECT count(*) as c FROM ${table} WHERE cliente_id BETWEEN ? AND ?`;
            else if (table === "expediente_cuotas" || table === "expediente_presupuesto_items") q = `SELECT count(*) as c FROM ${table} WHERE presupuesto_id IN (SELECT p.id FROM expediente_presupuesto p JOIN expediente e ON p.expediente_id = e.id WHERE e.cliente_id BETWEEN ? AND ?)`;
            else q = `SELECT count(*) as c FROM ${table} WHERE expediente_id IN (SELECT id FROM expediente WHERE cliente_id BETWEEN ? AND ?)`;

            const res = await query(q, [range.min, range.max]);
            console.log(`${table}: ${res.rows[0].c} records found.`);
        } catch (e: any) {
            console.log(`${table}: ERROR - ${e.message}`);
        }
    }
}
main();
