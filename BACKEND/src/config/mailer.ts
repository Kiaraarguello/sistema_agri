import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 465,
    secure: process.env.MAIL_SMTP_SSL_ENABLE === "true", // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});

// Verificar conexión al inicio
transporter.verify((error, success) => {
    if (error) {
        console.error("DEBUG: Error en conexión SMTP:", error);
    } else {
        console.log("DEBUG: Servidor de correo listo para enviar mensajes");
    }
});

export default transporter;
