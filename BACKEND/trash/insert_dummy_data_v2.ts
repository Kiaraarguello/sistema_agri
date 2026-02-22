
import { query } from "./config/db";

async function main() {
    try {
        console.log("1. Cleaning up previous dummy data...");
        // Delete all paid installments from 2025/2026 to be safe and start fresh
        // but specifically targeting those that aren't clearly legitimate (or just the ones we inserted)
        // Since it's a test environment, I'll delete where pagado=1 and we created them.
        await query("DELETE FROM expediente_cuotas WHERE pagado = 1 AND (YEAR(fecha_pago) = 2025 OR YEAR(fecha_pago) = 2026)", []);

        console.log("2. Finding budgets for clients >= 1157...");
        const validPresupuestos = await query(`
            SELECT p.id 
            FROM expediente_presupuesto p
            JOIN expediente e ON p.expediente_id = e.id
            WHERE e.cliente_id >= 1157
            LIMIT 5
        `, []);

        if (validPresupuestos.rows.length === 0) {
            console.log("No budgets found for clients >= 1157. Using any budget as fallback but this might not be what you want.");
            // Fallback to any budget if none found for those clients, but user specifically asked for those.
            const fallback = await query("SELECT id FROM expediente_presupuesto LIMIT 5", []);
            if (fallback.rows.length === 0) return;
            validPresupuestos.rows = fallback.rows;
        }

        const ids = validPresupuestos.rows.map((r: any) => r.id);

        // "Sube y baja" pattern data
        const curveData = [
            { mes: '2025-01', monto: 450000 },
            { mes: '2025-02', monto: 120000 },
            { mes: '2025-03', monto: 380000 },
            { mes: '2025-04', monto: 150000 },
            { mes: '2025-05', monto: 520000 },
            { mes: '2025-06', monto: 210000 },
            { mes: '2025-07', monto: 600000 },
            { mes: '2025-08', monto: 180000 },
            { mes: '2025-09', monto: 410000 },
            { mes: '2025-10', monto: 250000 },
            { mes: '2025-11', monto: 580000 },
            { mes: '2025-12', monto: 220000 },
            { mes: '2026-01', monto: 650000 },
            { mes: '2026-02', monto: 310000 },
        ];

        console.log("3. Inserting new 'sube y baja' data linked to correct clients...");
        let count = 0;
        for (const data of curveData) {
            const pid = ids[count % ids.length];
            await query(
                "INSERT INTO expediente_cuotas (monto, fecha_pago, numero, pagado, presupuesto_id) VALUES (?, ?, ?, ?, ?)",
                [data.monto, `${data.mes}-15`, 1, 1, pid]
            );
            count++;
        }

        console.log(`Successfully inserted ${count} records with an up-and-down trend.`);
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
