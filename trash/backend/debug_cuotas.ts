import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);
    const [rows]: any = await connection.execute('SELECT ep.id, ep.expediente_id, ep.cantidad_cuotas, (SELECT COUNT(*) FROM expediente_cuotas WHERE presupuesto_id = ep.id) as count_cuotas FROM expediente_presupuesto ep');
    console.log('Expediente Presupuesto:', rows);
    const [cuotas]: any = await connection.execute('SELECT * FROM expediente_cuotas');
    console.log('Cuotas:', cuotas);
    await connection.end();
}

check();
