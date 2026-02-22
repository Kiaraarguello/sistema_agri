
import { query } from "./config/db";

async function safeDelete(tableName: string, range: any, subquery: string) {
    try {
        await query(`DELETE FROM ${tableName} WHERE ${subquery}`, [range.min, range.max]);
        console.log(`- Success: ${tableName}`);
    } catch (e: any) {
        if (e.message.includes("doesn't exist")) {
            console.log(`- Skip: ${tableName} (table not found)`);
        } else {
            console.log(`- Error ${tableName}: ${e.message}`);
        }
    }
}

async function main() {
    const range = { min: 1156, max: 1175 };
    console.log(`Cleaning ID range [${range.min} - ${range.max}]...`);

    const pSub = "presupuesto_id IN (SELECT p.id FROM expediente_presupuesto p JOIN expediente e ON p.expediente_id = e.id WHERE e.cliente_id BETWEEN ? AND ?)";
    const eSub = "expediente_id IN (SELECT id FROM expediente WHERE cliente_id BETWEEN ? AND ?)";
    const cliSub = "cliente_id BETWEEN ? AND ?";
    const idSub = "id BETWEEN ? AND ?";

    await safeDelete("expediente_cuotas", range, pSub);
    await safeDelete("expediente_presupuesto_items", range, pSub);
    await safeDelete("expediente_presupuesto", range, eSub);
    await safeDelete("expediente_firmante", range, eSub);
    await safeDelete("expediente_firmantes", range, eSub);
    await safeDelete("terreno", range, eSub);
    await safeDelete("expediente", range, cliSub);
    await safeDelete("clientes", range, idSub);

    console.log("Finished.");
}
main();
