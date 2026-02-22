import { query } from './src/db';

async function revertDefaults() {
    try {
        const textFields = [
            'direccion', 'depto', 'parcela', 'lote', 'partida_inmobiliaria',
            'objeto', 'expte_muni', 'certificado_catastral', 'informe_dominial',
            'titular', 'responsable', 'telefono_contacto', 'disposicion_n',
            'expediente_n', 'campo1', 'notas', 'materiales', 'pdf_catastro_file',
            'cert_catastral_file'
        ];

        for (const field of textFields) {
            await query(`UPDATE expediente SET ${field} = NULL WHERE ${field} = 'No cargado'`);
        }

        const dateFields = [
            'fecha_relevamiento', 'fecha_presentacion_municipalidad', 'fecha_ingreso_dominio',
            'fecha_egreso_dominio', 'fecha_presupuesto', 'fecha_libre_deuda',
            'presentacion_dgc', 'previa_dgc', 'definitiva_dgc', 'visado_dgc', 'fecha_apertura'
        ];
        for (const field of dateFields) {
            try {
                // Usar YEAR() para evitar errores de comparación de strings de fecha
                await query(`UPDATE expediente SET ${field} = NULL WHERE ${field} IS NOT NULL AND (YEAR(${field}) < 1900 OR YEAR(${field}) = 0)`);
            } catch (e) {
                console.log(`No se pudo limpiar ${field}:`, e);
            }
        }

        console.log("¡Limpieza completada!");
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

revertDefaults();
