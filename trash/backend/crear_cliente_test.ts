import { query } from "./src/db";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

async function createClientUser() {
    try {
        const username = "cliente1";
        const pass = "Cliente2024!";
        const nombre = "Comitente de Prueba";
        const email = "cliente@ejemplo.com";

        console.log(`Creando usuario cliente: ${username}...`);

        const hashedPw = await bcrypt.hash(pass, 10);

        await query(`
            INSERT INTO usuarios (username, password, nombre, email, rol, activo) 
            VALUES (?, ?, ?, ?, 'cliente', 1) 
            ON DUPLICATE KEY UPDATE password = ?, nombre = ?, email = ?, rol = 'cliente', activo = 1
        `, [username, hashedPw, nombre, email, hashedPw, nombre, email]);

        console.log("------------------------------------------");
        console.log("¡Usuario cliente creado con éxito!");
        console.log(`Usuario: ${username}`);
        console.log(`Contraseña: ${pass}`);
        console.log("------------------------------------------");

        process.exit(0);
    } catch (e) {
        console.error("Error al crear cliente:", e);
        process.exit(1);
    }
}

createClientUser();
