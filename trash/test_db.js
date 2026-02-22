const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function checkData() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    });

    try {
        console.log("Checking tables...");
        const [tables] = await pool.query("SHOW TABLES");
        console.log("Tables:", tables);

        const [cols] = await pool.query("DESCRIBE expediente_presupuesto");
        console.log("Cols of expediente_presupuesto:", cols);

        const [data] = await pool.query(`
            SELECT e.id, ep.total_a_pagar 
            FROM expediente e 
            LEFT JOIN expediente_presupuesto ep ON e.id = ep.expediente_id 
            ORDER BY e.id DESC LIMIT 5
        `);
        console.log("Recent data:", data);

    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

checkData();
