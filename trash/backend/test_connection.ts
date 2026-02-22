import { query } from './src/db';

async function testConnection() {
    try {
        console.log("Testeando conexión a la base de datos...");
        const result = await query("SELECT 1 as result");
        console.log("CONEXIÓN EXITOSA:", result.rows);
        process.exit(0);
    } catch (err) {
        console.error("ERROR DE CONEXIÓN:", err);
        process.exit(1);
    }
}

testConnection();
