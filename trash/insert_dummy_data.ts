
import { query } from "./config/db";

async function main() {
    try {
        console.log("Listing tables...");
        const tables = await query("SHOW TABLES", []);
        console.log("Tables:", tables.rows);

        console.log("Describing expediente_cuotas...");
        const columns = await query("DESCRIBE expediente_cuotas", []);
        console.log("Columns:", columns.rows);

        // Get a valid presupuesto_id if possible
        const presupuestos = await query("SELECT id FROM expediente_presupuesto LIMIT 1", []);
        if (presupuestos.rows.length === 0) {
            console.log("No budgets found to link payments to.");
            return;
        }
        const presupuestoId = presupuestos.rows[0].id;

        const dummyData = [
            { monto: 120000, fecha_pago: '2025-05-10', numero: 1, pagado: 1, presupuesto_id: presupuestoId },
            { monto: 140000, fecha_pago: '2025-06-12', numero: 1, pagado: 1, presupuesto_id: presupuestoId },
            { monto: 160000, fecha_pago: '2025-07-15', numero: 1, pagado: 1, presupuesto_id: presupuestoId },
            { monto: 130000, fecha_pago: '2025-08-18', numero: 1, pagado: 1, presupuesto_id: presupuestoId },
            { monto: 170000, fecha_pago: '2025-09-20', numero: 1, pagado: 1, presupuesto_id: presupuestoId },
            { monto: 150000, fecha_pago: '2025-10-15', numero: 1, pagado: 1, presupuesto_id: presupuestoId },
            { monto: 220000, fecha_pago: '2025-11-20', numero: 2, pagado: 1, presupuesto_id: presupuestoId },
            { monto: 180000, fecha_pago: '2025-12-05', numero: 3, pagado: 1, presupuesto_id: presupuestoId },
            { monto: 350000, fecha_pago: '2026-01-10', numero: 1, pagado: 1, presupuesto_id: presupuestoId },
            { monto: 420000, fecha_pago: '2026-01-25', numero: 2, pagado: 1, presupuesto_id: presupuestoId },
            { monto: 280000, fecha_pago: '2026-02-02', numero: 1, pagado: 1, presupuesto_id: presupuestoId },
            { monto: 150000, fecha_pago: '2026-02-15', numero: 2, pagado: 1, presupuesto_id: presupuestoId },
        ];

        console.log("Inserting dummy data...");
        for (const data of dummyData) {
            await query(
                "INSERT INTO expediente_cuotas (monto, fecha_pago, numero, pagado, presupuesto_id) VALUES (?, ?, ?, ?, ?)",
                [data.monto, data.fecha_pago, data.numero, data.pagado, data.presupuesto_id]
            );
        }

        console.log("Dummy data inserted successfully.");
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
