
import { query } from "./config/db";

async function main() {
    try {
        const lastBudgets = await query(`
            SELECT p.id, e.fecha_presupuesto, p.total_a_pagar 
            FROM expediente_presupuesto p 
            JOIN expediente e ON p.expediente_id = e.id 
            ORDER BY p.id DESC LIMIT 5
        `, []);
        console.log("LAST BUDGETS:", lastBudgets.rows);

        const lastPayments = await query(`
            SELECT id, fecha_pago, monto, pagado 
            FROM expediente_cuotas 
            ORDER BY id DESC LIMIT 5
        `, []);
        console.log("LAST PAYMENTS:", lastPayments.rows);

        const counts = await query(`
            SELECT 
                (SELECT COUNT(*) FROM expediente_presupuesto) as budgets,
                (SELECT COUNT(*) FROM expediente_cuotas) as payments
        `, []);
        console.log("COUNTS:", counts.rows[0]);

    } catch (e) {
        console.error(e);
    }
}
main();
