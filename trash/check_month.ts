
import { query } from "./config/db";

async function main() {
    try {
        const res = await query(`
            SELECT count(*) as c 
            FROM expediente 
            WHERE MONTH(fecha_presupuesto) = MONTH(NOW()) 
              AND YEAR(fecha_presupuesto) = YEAR(NOW())
        `, []);
        console.log("EXPEDIENTES THIS MONTH:", res.rows[0].c);

        const res2 = await query(`
            SELECT count(*) as c 
            FROM expediente_cuotas 
            WHERE pagado = 1 
              AND MONTH(fecha_pago) = MONTH(NOW()) 
              AND YEAR(fecha_pago) = YEAR(NOW())
        `, []);
        console.log("PAYMENTS THIS MONTH:", res2.rows[0].c);
    } catch (e) {
        console.error(e);
    }
}
main();
