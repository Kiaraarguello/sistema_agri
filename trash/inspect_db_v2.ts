
import { query } from "./config/db";

async function main() {
    try {
        const tables = await query("SHOW TABLES", []);
        console.log("Tables:", tables.rows);

        const expPresCols = await query("DESCRIBE expediente_presupuesto", []);
        console.log("Columns of expediente_presupuesto:", expPresCols.rows);

        const expCols = await query("DESCRIBE expediente", []);
        console.log("Columns of expediente:", expCols.rows);

        const counts = await query(`
            SELECT 
                (SELECT COUNT(*) FROM expediente) as n_expedientes,
                (SELECT COUNT(*) FROM expediente_presupuesto) as n_presupuestos,
                (SELECT COUNT(*) FROM expediente_cuotas) as n_cuotas,
                (SELECT COUNT(*) FROM expediente_cuotas WHERE pagado = 1) as n_pagos
        `, []);
        console.log("Counts:", counts.rows[0]);

        const dateCheck = await query(`
            SELECT id, fecha_presupuesto FROM expediente WHERE fecha_presupuesto IS NOT NULL LIMIT 5
        `, []);
        console.log("Date check (expediente):", dateCheck.rows);

    } catch (error) {
        console.error("Error:", error);
    }
}

main();
