import { query } from './src/db';

async function checkData() {
    try {
        const noCargado = await query("SELECT COUNT(*) as count FROM expediente WHERE expediente_n = 'No cargado'");
        const nullExpN = await query("SELECT COUNT(*) as count FROM expediente WHERE expediente_n IS NULL");
        const emptyExpN = await query("SELECT COUNT(*) as count FROM expediente WHERE expediente_n = ''");

        const dummyDate = await query("SELECT COUNT(*) as count FROM expediente WHERE presentacion_dgc = '1000-01-01'");
        const nullDate = await query("SELECT COUNT(*) as count FROM expediente WHERE presentacion_dgc IS NULL");

        console.log("Expediente N 'No cargado':", noCargado.rows[0].count);
        console.log("Expediente N NULL:", nullExpN.rows[0].count);
        console.log("Expediente N empty:", emptyExpN.rows[0].count);
        console.log("Presentacion DGC '1000-01-01':", dummyDate.rows[0].count);
        console.log("Presentacion DGC NULL:", nullDate.rows[0].count);

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkData();
