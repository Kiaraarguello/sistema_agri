import { query } from "./src/db";

async function createCalendarioTable() {
    try {
        console.log("Creando tabla de notas del calendario...");
        await query(`
            CREATE TABLE IF NOT EXISTS calendario_notas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                fecha DATE NOT NULL,
                contenido TEXT NOT NULL,
                tipo VARCHAR(50) DEFAULT 'nota',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Tabla creada exitosamente.");
        process.exit(0);
    } catch (e) {
        console.error("Error creando tabla:", e);
        process.exit(1);
    }
}

createCalendarioTable();
