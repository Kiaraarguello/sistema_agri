import { query } from './src/db';

async function migrate() {
    try {
        console.log("Adding columns to 'expediente_presupuesto_items'...");
        await query("ALTER TABLE expediente_presupuesto_items ADD COLUMN monto_porcentaje DECIMAL(12,2) DEFAULT 0;");
        await query("ALTER TABLE expediente_presupuesto_items ADD COLUMN porcentaje DECIMAL(5,2) DEFAULT 0;");
        console.log("Migration successful!");
        process.exit(0);
    } catch (error: any) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();
