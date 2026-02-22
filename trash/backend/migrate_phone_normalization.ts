import { query } from './src/db';

async function migratePhone() {
    try {
        console.log("Starting phone migration...");

        // 1. Sync data from expediente.telefono_contacto to clientes.telefono if clientes.telefono is empty/null
        console.log("Syncing phone data to clientes table...");
        await query(`
            UPDATE clientes c
            JOIN expediente e ON e.cliente_id = c.id
            SET c.telefono = e.telefono_contacto
            WHERE (c.telefono IS NULL OR c.telefono = '' OR c.telefono = 'No cargado')
              AND (e.telefono_contacto IS NOT NULL AND e.telefono_contacto != '' AND e.telefono_contacto != 'No cargado')
        `);

        // 2. Drop the column from expediente
        console.log("Dropping telefono_contacto from expediente...");
        await query("ALTER TABLE expediente DROP COLUMN telefono_contacto");

        console.log("Phone migration completed successfully.");
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migratePhone().then(() => process.exit(0));
