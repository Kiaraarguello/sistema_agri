
import { obtenerEstadisticasFinancieras } from "./servicios/finanzasServicio";

async function main() {
    console.log("--- STATS CHECK ---");
    try {
        const month = await obtenerEstadisticasFinancieras('month');
        console.log("MONTH STATS:", JSON.stringify(month.kpis, null, 2));

        const all = await obtenerEstadisticasFinancieras('all');
        console.log("ALL TIME STATS:", JSON.stringify(all.kpis, null, 2));

        console.log("MONTH CHARTS DATA LENGTH:", month.graficos.cobranzaMensual.length);
        console.log("DEUDORES LENGTH:", month.graficos.deudores.length);
        console.log("ULTIMOS COBROS LENGTH:", month.ultimosCobros.length);
    } catch (e) {
        console.error(e);
    }
}
main();
