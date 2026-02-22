import { query } from "./src/db";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

async function actualizarPass() {
    try {
        const username = "kiara_admin";
        const nuevaPass = "KiarAgrim2025*Sistemas#Access";
        const hashedPw = await bcrypt.hash(nuevaPass, 10);

        await query("UPDATE usuarios SET password = ? WHERE username = ?", [hashedPw, username]);

        console.log("------------------------------------------");
        console.log("¡Contraseña actualizada con éxito!");
        console.log(`Usuario: ${username}`);
        console.log(`Nueva Contraseña: ${nuevaPass}`);
        console.log("------------------------------------------");

        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

actualizarPass();
