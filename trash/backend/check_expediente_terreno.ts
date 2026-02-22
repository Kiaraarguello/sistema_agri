import { query } from './src/db';

async function main() {
    try {
        const result = await query("SHOW COLUMNS FROM expediente_terreno");
        console.log("COLUMNS IN expediente_terreno:");
        console.table(result.rows);
    } catch (error) {
        console.error("Error:", error);
    }
    process.exit(0);
}

main();
