import { query } from './src/db';

async function migrate() {
    try {
        console.log("Adding columns to 'expediente_presupuesto'...");
        await query("ALTER TABLE expediente_presupuesto ADD COLUMN cantidad_cuotas INT DEFAULT 1;");
        await query("ALTER TABLE expediente_presupuesto ADD COLUMN cuotas_iguales BOOLEAN DEFAULT TRUE;");

        console.log("Creating 'expediente_cuotas' table...");
        await query(`
            CREATE TABLE IF NOT EXISTS expediente_cuotas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                presupuesto_id INT NOT NULL,
                numero INT NOT NULL,
                monto DECIMAL(12,2) NOT NULL DEFAULT 0,
                pagado BOOLEAN NOT NULL DEFAULT FALSE,
                fecha_pago DATETIME DEFAULT NULL,
                INDEX (presupuesto_id),
                FOREIGN KEY (presupuesto_id) REFERENCES expediente_presupuesto(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        console.log("Migration successful!");
        process.exit(0);
    } catch (error: any) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();
