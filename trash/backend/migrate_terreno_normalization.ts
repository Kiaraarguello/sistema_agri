import { query } from './src/db';

async function migrate() {
    try {
        console.log("Starting migration...");

        // 1. Rename expediente_terreno to terreno
        console.log("Renaming expediente_terreno to terreno...");
        await query("RENAME TABLE expediente_terreno TO terreno");

        // 2. Add columns to terreno
        console.log("Adding columns to terreno...");
        await query(`
            ALTER TABLE terreno 
            ADD COLUMN depto LONGTEXT,
            ADD COLUMN municipio INT,
            ADD COLUMN seccion INT,
            ADD COLUMN chacra INT,
            ADD COLUMN manzana INT,
            ADD COLUMN parcela LONGTEXT,
            ADD COLUMN lote LONGTEXT
        `);

        // 3. Add terreno_id to expediente
        console.log("Adding terreno_id to expediente...");
        await query("ALTER TABLE expediente ADD COLUMN terreno_id BIGINT");

        // 4. Sync data for existing terrains
        console.log("Syncing data for existing terrains...");
        await query(`
            UPDATE terreno t
            JOIN expediente e ON t.expediente_id = e.id
            SET t.depto = e.depto,
                t.municipio = e.municipio,
                t.seccion = e.seccion,
                t.chacra = e.chacra,
                t.manzana = e.manzana,
                t.parcela = e.parcela,
                t.lote = e.lote
        `);

        // 5. Update expediente with terreno_id for existing terrains
        console.log("Updating expediente with terreno_id for existing terrains...");
        await query(`
            UPDATE expediente e
            JOIN terreno t ON e.id = t.expediente_id
            SET e.terreno_id = t.id
        `);

        // 6. Create terrains for expedientes that don't have one
        console.log("Creating terrains for expedientes without one...");
        await query(`
            INSERT INTO terreno (expediente_id, direccion, depto, municipio, seccion, chacra, manzana, parcela, lote)
            SELECT id, direccion, depto, municipio, seccion, chacra, manzana, parcela, lote
            FROM expediente
            WHERE terreno_id IS NULL
        `);

        // 7. Update the newly created terreno_ids in expediente
        console.log("Linking newly created terrains to entries in expediente...");
        await query(`
            UPDATE expediente e
            JOIN terreno t ON e.id = t.expediente_id
            SET e.terreno_id = t.id
            WHERE e.terreno_id IS NULL
        `);

        console.log("Migration part 1 (safe) completed successfully.");
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate().then(() => process.exit(0));
