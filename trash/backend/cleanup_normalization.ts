import { query } from './src/db';

async function cleanup() {
    try {
        console.log("Starting cleanup (removing old columns from expediente)...");

        await query(`
            ALTER TABLE expediente 
            DROP COLUMN direccion,
            DROP COLUMN depto,
            DROP COLUMN municipio,
            DROP COLUMN seccion,
            DROP COLUMN chacra,
            DROP COLUMN manzana,
            DROP COLUMN parcela,
            DROP COLUMN lote
        `);

        console.log("Cleanup completed successfully.");
    } catch (error) {
        console.error("Cleanup failed:", error);
        process.exit(1);
    }
}

cleanup().then(() => process.exit(0));
