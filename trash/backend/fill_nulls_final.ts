import { query } from './src/db';

async function fillNulls() {
    try {
        console.log("Iniciando proceso de relleno de campos nulos/vacíos...");

        // Definimos los campos por tipo basado en la estructura exportada
        const textFields = [
            'cliente', 'direccion', 'depto', 'parcela', 'lote', 'partida_inmobiliaria',
            'objeto', 'expte_muni', 'certificado_catastral', 'informe_dominial',
            'titular', 'responsable', 'telefono_contacto', 'disposicion_n',
            'expediente_n', 'campo1', 'notas', 'materiales', 'pdf_catastro_file',
            'cert_catastral_file'
        ];

        const numberFields = [
            'municipio', 'seccion', 'chacra', 'manzana', 'importe_presupuesto', 'cliente_id'
        ];

        const dateFields = [
            'fecha_relevamiento', 'fecha_presentacion_municipalidad', 'fecha_ingreso_dominio',
            'fecha_egreso_dominio', 'fecha_presupuesto', 'fecha_libre_deuda',
            'presentacion_dgc', 'previa_dgc', 'definitiva_dgc', 'visado_dgc', 'fecha_apertura'
        ];

        const booleanFields = [
            'falta_relevar', 'entrega', 'aprobacion_muni', 'plano_registrado',
            'correccion', 'terminado'
        ];

        // 1. Rellenar Textos con "No cargado"
        for (const field of textFields) {
            console.log(`Actualizando texto: ${field}`);
            await query(`UPDATE expediente SET ${field} = 'No cargado' WHERE ${field} IS NULL OR ${field} = ''`);
        }

        // 2. Rellenar Números con 0
        for (const field of numberFields) {
            console.log(`Actualizando número: ${field}`);
            await query(`UPDATE expediente SET ${field} = 0 WHERE ${field} IS NULL`);
        }

        // 3. Rellenar Booleanos con 0 (false)
        for (const field of booleanFields) {
            console.log(`Actualizando booleano: ${field}`);
            await query(`UPDATE expediente SET ${field} = 0 WHERE ${field} IS NULL`);
        }

        // 4. Rellenar Fechas (Tratamos de usar '0000-00-00' o dejar NULL si falla)
        for (const field of dateFields) {
            console.log(`Intentando actualizar fecha: ${field}`);
            try {
                // Intentamos poner '0000-00-00' que es lo más parecido a 0/0/0000 en MySQL si está permitido
                await query(`UPDATE expediente SET ${field} = '0000-00-00' WHERE ${field} IS NULL`);
            } catch (err) {
                console.log(`No se pudo usar '0000-00-00' para ${field} (posible restricción de MySQL). Usando '1000-01-01' como valor neutral.`);
                try {
                    await query(`UPDATE expediente SET ${field} = '1000-01-01' WHERE ${field} IS NULL`);
                } catch (innerErr) {
                    console.error(`Error final en campo de fecha ${field}:`, innerErr);
                }
            }
        }

        console.log("¡Proceso completado con éxito!");
        process.exit(0);
    } catch (error) {
        console.error("Error general en el proceso:", error);
        process.exit(1);
    }
}

fillNulls();
