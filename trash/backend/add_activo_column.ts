import { query } from "./src/db";

async function addActivoColumn() {
    try {
        console.log("Checking clientes table...");
        const cols = await query("DESCRIBE clientes");
        const hasActivo = cols.rows.some((c: any) => c.Field === 'activo');

        if (!hasActivo) {
            console.log("Adding 'activo' column to clientes...");
            await query("ALTER TABLE clientes ADD COLUMN activo BOOLEAN DEFAULT 1");
            console.log("Column added successfully.");
        } else {
            console.log("'activo' column already exists.");
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

addActivoColumn();
