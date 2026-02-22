const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        const [tables] = await connection.query("SHOW TABLES");
        console.log("TABLES:", tables);

        const [expCols] = await connection.query("SHOW COLUMNS FROM expediente");
        console.log("COLUMNS expediente:", expCols);

        try {
            const [terCols] = await connection.query("SHOW COLUMNS FROM expediente_terreno");
            console.log("COLUMNS expediente_terreno:", terCols);
        } catch (e) {
            console.log("expediente_terreno not found");
        }

        await connection.end();
    } catch (err) {
        console.error(err);
    }
}
main();
