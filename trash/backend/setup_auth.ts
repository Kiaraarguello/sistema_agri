import { query } from "./src/db";
import bcrypt from "bcryptjs";

async function setupAuth() {
    try {
        console.log("Configurando tabla de usuarios...");
        await query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                nombre VARCHAR(100),
                intentos_fallidos INT DEFAULT 0,
                bloqueado_hasta DATETIME DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Crear un usuario administrador por defecto si no existe
        const exists = await query("SELECT id FROM usuarios WHERE username = 'admin'");
        if (exists.rows.length === 0) {
            const hashedPw = await bcrypt.hash("admin123", 10);
            await query("INSERT INTO usuarios (username, password, nombre) VALUES (?, ?, ?)",
                ["admin", hashedPw, "Administrador"]);
            console.log("Usuario 'admin' creado con éxito (pass: admin123)");
        }

        console.log("Configuración de seguridad completada.");
        process.exit(0);
    } catch (e) {
        console.error("Error en setupAuth:", e);
        process.exit(1);
    }
}

setupAuth();
