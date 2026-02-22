import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de MySQL desde .env
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Wrapper para mantener compatibilidad con el código anterior que esperaba .rows
export const query = async (sql: string, params: any[] = []) => {
    try {
        // Reemplazar $1, $2, etc por ? (estilo MySQL)
        const formattedSql = sql.replace(/\$\d+/g, '?');
        const [rows] = await pool.query(formattedSql, params);
        return { rows: rows as any[] };
    } catch (error) {
        console.error("Database query error:", error);
        throw error;
    }
};

export default pool;
