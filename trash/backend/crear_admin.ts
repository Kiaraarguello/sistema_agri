import { query } from "./src/db";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

async function createAdmin() {
    try {
        const username = "kiara_admin";
        const pass = "Agrimensura2024!"; // Contraseña segura pero recordable
        const nombre = "Kiara Arguello";

        console.log(`Creando usuario administrador: ${username}...`);

        const hashedPw = await bcrypt.hash(pass, 10);

        // Verificar si existe la tabla
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

        // Insertar o actualizar
        await query(`
            INSERT INTO usuarios (username, password, nombre) 
            VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE password = ?, nombre = ?
        `, [username, hashedPw, nombre, hashedPw, nombre]);

        console.log("------------------------------------------");
        console.log("¡Usuario creado con éxito!");
        console.log(`Usuario: ${username}`);
        console.log(`Contraseña: ${pass}`);
        console.log("------------------------------------------");

        process.exit(0);
    } catch (e) {
        console.error("Error al crear admin:", e);
        process.exit(1);
    }
}

createAdmin();
