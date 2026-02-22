
import { query } from "./config/db";

async function main() {
    try {
        console.log("1. Cleaning up previous dummy data (Clients >= 1157 and their linked records)...");
        // We delete in reverse order of dependencies
        await query("DELETE FROM expediente_cuotas WHERE presupuesto_id IN (SELECT p.id FROM expediente_presupuesto p JOIN expediente e ON p.expediente_id = e.id WHERE e.cliente_id >= 1157)", []);
        await query("DELETE FROM expediente_presupuesto WHERE expediente_id IN (SELECT id FROM expediente WHERE cliente_id >= 1157)", []);
        await query("DELETE FROM expediente WHERE cliente_id >= 1157", []);
        await query("DELETE FROM clientes WHERE id >= 1157", []);

        console.log("2. Creating dummy clients starting from 1157...");
        const clientIds = [1157, 1158, 1159, 1160, 1161];
        for (const id of clientIds) {
            await query("INSERT INTO clientes (id, nombre_completo, dni_cuil, activo) VALUES (?, ?, ?, 1)", [id, `Cliente Ficticio ${id}`, `DNI-${id}`]);
        }

        console.log("3. Creating dummy expedientes for these clients...");
        const expedienteIds: number[] = [];
        const hoy = new Date().toISOString().split('T')[0];
        for (const cid of clientIds) {
            const res: any = await query(
                "INSERT INTO expediente (cliente_id, objeto, cliente, fecha_presupuesto) VALUES (?, ?, ?, ?)",
                [cid, "Proyecto de Prueba Finanzas", `Cliente Ficticio ${cid}`, hoy]
            );
            expedienteIds.push(res.rows.insertId);
        }

        console.log("4. Creating dummy budgets...");
        const presupuestoIds: number[] = [];
        for (const eid of expedienteIds) {
            const res: any = await query("INSERT INTO expediente_presupuesto (expediente_id, total_a_pagar) VALUES (?, ?)", [eid, 1500000]); // 1.5M cada uno
            presupuestoIds.push(res.rows.insertId);
        }

        // "Sube y baja" pattern data (Oscillating)
        const curveData = [
            { mes: '2025-01', monto: 180000 },
            { mes: '2025-02', monto: 520000 },
            { mes: '2025-03', monto: 150000 },
            { mes: '2025-04', monto: 680000 },
            { mes: '2025-05', monto: 210000 },
            { mes: '2025-06', monto: 590000 },
            { mes: '2025-07', monto: 120000 },
            { mes: '2025-08', monto: 750000 },
            { mes: '2025-09', monto: 230000 },
            { mes: '2025-10', monto: 620000 },
            { mes: '2025-11', monto: 180000 },
            { mes: '2025-12', monto: 710000 },
            { mes: '2026-01', monto: 310000 },
            { mes: '2026-02', monto: 650000 },
        ];

        console.log("5. Inserting oscillating payments...");
        let count = 0;
        for (const data of curveData) {
            const pid = presupuestoIds[count % presupuestoIds.length];
            await query(
                "INSERT INTO expediente_cuotas (monto, fecha_pago, numero, pagado, presupuesto_id) VALUES (?, ?, ?, ?, ?)",
                [data.monto, `${data.mes}-15`, 1, 1, pid]
            );
            count++;
        }

        console.log(`\nSUCCESS:`);
        console.log(`- Created ${clientIds.length} fake clients (IDs 1157-1161)`);
        console.log(`- Created ${expedienteIds.length} associated expedientes`);
        console.log(`- Inserted ${count} payments with a sharp up-and-down trend.`);
    } catch (error) {
        console.error("Critical Error during setup:", error);
    }
}

main();
