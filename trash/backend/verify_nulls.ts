import { query } from './src/db';

async function checkNulls() {
    try {
        const res = await query("SELECT COUNT(*) as total FROM expediente");
        console.log(`Total records: ${res.rows[0].total}`);

        // Check some columns
        const cols = ['cliente', 'municipio', 'fecha_relevamiento', 'terminado'];
        for (const col of cols) {
            const nullRes = await query(`SELECT COUNT(*) as nullCount FROM expediente WHERE ${col} IS NULL`);
            console.log(`Column ${col} has ${nullRes.rows[0].nullCount} NULLs`);
        }
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}
checkNulls();
