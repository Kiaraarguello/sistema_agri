
import { query } from "./config/db";

async function main() {
    try {
        console.log("Cleaning up dummy data...");
        // This targets the specific montos and dates we inserted. 
        // A safer way would be to track IDs, but since we know the exact values:
        const dummyMontos = [120000, 140000, 160000, 130000, 170000, 150000, 220000, 180000, 350000, 420000, 280000];

        const result = await query(
            "DELETE FROM expediente_cuotas WHERE monto IN (?) AND pagado = 1 AND (YEAR(fecha_pago) = 2025 OR YEAR(fecha_pago) = 2026)",
            [dummyMontos]
        );

        console.log("Cleanup complete. Rows affected:", result.affectedRows);
    } catch (error) {
        console.error("Error during cleanup:", error);
    }
}

main();
