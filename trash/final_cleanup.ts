
import { query } from "./config/db";

async function main() {
    const range = { min: 1156, max: 1175 };
    console.log(`Starting cleanup of dummy data for Client IDs [${range.min} - ${range.max}]...`);

    try {
        // 1. Delete cuotas
        await query(`
            DELETE FROM expediente_cuotas 
            WHERE presupuesto_id IN (
                SELECT p.id FROM expediente_presupuesto p 
                JOIN expediente e ON p.expediente_id = e.id 
                WHERE e.cliente_id BETWEEN ? AND ?
            )
        `, [range.min, range.max]);
        console.log("- Deleted from expediente_cuotas");

        // 2. Delete budget items
        await query(`
            DELETE FROM expediente_presupuesto_items 
            WHERE presupuesto_id IN (
                SELECT p.id FROM expediente_presupuesto p 
                JOIN expediente e ON p.expediente_id = e.id 
                WHERE e.cliente_id BETWEEN ? AND ?
            )
        `, [range.min, range.max]);
        console.log("- Deleted from expediente_presupuesto_items");

        // 3. Delete budgets
        await query(`
            DELETE FROM expediente_presupuesto 
            WHERE expediente_id IN (
                SELECT id FROM expediente WHERE cliente_id BETWEEN ? AND ?
            )
        `, [range.min, range.max]);
        console.log("- Deleted from expediente_presupuesto");

        // 4. Delete firmantes
        await query(`
            DELETE FROM expediente_firmante 
            WHERE expediente_id IN (
                SELECT id FROM expediente WHERE cliente_id BETWEEN ? AND ?
            )
        `, [range.min, range.max]);
        console.log("- Deleted from expediente_firmante");

        // 5. Delete terrenos
        await query(`
            DELETE FROM terreno 
            WHERE expediente_id IN (
                SELECT id FROM expediente WHERE cliente_id BETWEEN ? AND ?
            )
        `, [range.min, range.max]);
        console.log("- Deleted from terreno");

        // 6. Delete expedientes
        await query(`
            DELETE FROM expediente WHERE cliente_id BETWEEN ? AND ?
        `, [range.min, range.max]);
        console.log(`- Deleted expedientes`);

        // 7. Finally, delete clients
        await query(`
            DELETE FROM clientes WHERE id BETWEEN ? AND ?
        `, [range.min, range.max]);
        console.log(`- Deleted clients`);

        console.log("\nCleanup finished successfully!");
    } catch (error) {
        console.error("Error during cleanup:", error);
    }
}

main();
