import { obtenerEstadisticasDashboard } from "./src/servicios/dashboardServicio";

async function test() {
    try {
        console.log("Probando obtenerEstadisticasDashboard...");
        const result = await obtenerEstadisticasDashboard();
        console.log("Resultado exitoso:", JSON.stringify(result, null, 2));
        process.exit(0);
    } catch (e) {
        console.error("ERROR en dashboardServicio:", e);
        process.exit(1);
    }
}

test();
