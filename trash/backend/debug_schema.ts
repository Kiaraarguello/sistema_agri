import { query } from './src/db';

async function main() {
    try {
        const tables = await query("SHOW TABLES");
        console.log("TABLES:");
        console.log(JSON.stringify(tables.rows, null, 2));

        const expCols = await query("SHOW COLUMNS FROM expediente");
        console.log("\nCOLUMNS IN expediente:");
        console.log(JSON.stringify(expCols.rows, null, 2));

        try {
            const terCols = await query("SHOW COLUMNS FROM expediente_terreno");
            console.log("\nCOLUMNS IN expediente_terreno:");
            console.log(JSON.stringify(terCols.rows, null, 2));
        } catch (e) {
            console.log("\nexpediente_terreno table not found or error accessing it.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
    process.exit(0);
}

main();
