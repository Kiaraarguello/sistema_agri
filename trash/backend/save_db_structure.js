const mysql = require('mysql2/promise');
const fs = require('fs');
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
        const results = { tables };

        for (const tableRow of tables) {
            const tableName = Object.values(tableRow)[0];
            const [columns] = await connection.query(`SHOW COLUMNS FROM ${tableName}`);
            results[tableName] = columns;
        }

        fs.writeFileSync('db_structure_complete.json', JSON.stringify(results, null, 2));
        console.log("Structure saved to db_structure_complete.json");

        await connection.end();
    } catch (err) {
        console.error(err);
    }
}
main();
