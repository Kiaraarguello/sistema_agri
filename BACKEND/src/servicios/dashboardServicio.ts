import { query } from "../config/db";

export const obtenerEstadisticasDashboard = async () => {
    try {
        const totalResult = await query('SELECT COUNT(*) as count FROM expediente e LEFT JOIN clientes c ON e.cliente_id = c.id WHERE c.activo = 1 OR c.id IS NULL');
        const terminadosResult = await query('SELECT COUNT(*) as count FROM expediente e LEFT JOIN clientes c ON e.cliente_id = c.id WHERE e.terminado = true AND (c.activo = 1 OR c.id IS NULL)');

        // 1. Catastro: Presentación DGC nula (Pendiente)
        const catastroResult = await query("SELECT COUNT(*) as count FROM expediente e LEFT JOIN clientes c ON e.cliente_id = c.id WHERE e.presentacion_dgc IS NULL AND (c.activo = 1 OR c.id IS NULL)");

        // 2. Presupuesto: Total a pagar > 0
        const presupuestoResult = await query(`
            SELECT COUNT(*) as count 
            FROM expediente_presupuesto p 
            JOIN expediente e ON p.expediente_id = e.id
            LEFT JOIN clientes c ON e.cliente_id = c.id
            WHERE (c.activo = 1 OR c.id IS NULL) AND p.total_a_pagar > 0
        `);

        // 3. Relevamiento: Algún servicio con realizado = 0 (pendiente)
        const relevamientoResult = await query(`
            SELECT COUNT(DISTINCT p.expediente_id) as count 
            FROM expediente_presupuesto_items i
            JOIN expediente_presupuesto p ON i.presupuesto_id = p.id
            JOIN expediente e ON p.expediente_id = e.id
            LEFT JOIN clientes c ON e.cliente_id = c.id
            WHERE i.realizado = 0 AND (c.activo = 1 OR c.id IS NULL)
        `);

        const recientesResult = await query(`
            SELECT e.*, c.nombre_completo as cliente_nombre,
                   ep.total_a_pagar as total_presupuesto,
                   (SELECT COUNT(*) FROM expediente_presupuesto_items epi WHERE epi.presupuesto_id = ep.id) as relev_total,
                   (SELECT COUNT(*) FROM expediente_presupuesto_items epi WHERE epi.presupuesto_id = ep.id AND epi.realizado = 1) as relev_hecho,
                   t.direccion as terreno_direccion,
                   t.pdf_ploteo,
                   t.cert_catastral as cert_terreno
            FROM expediente e 
            LEFT JOIN clientes c ON e.cliente_id = c.id 
            LEFT JOIN expediente_presupuesto ep ON e.id = ep.expediente_id
            LEFT JOIN terreno t ON e.terreno_id = t.id
            WHERE c.activo = 1 OR c.activo IS NULL
            ORDER BY e.id DESC 
            LIMIT 10
        `);

        const total = parseInt(totalResult.rows[0].count);
        const terminados = parseInt(terminadosResult.rows[0].count);
        const catastro = parseInt(catastroResult.rows[0].count);
        const presupuesto = parseInt(presupuestoResult.rows[0].count);
        const relevamiento = parseInt(relevamientoResult.rows[0].count);
        const enProceso = total - terminados;

        // 4. Alertas de Visado (6 meses)
        const alertasVisado = await query(`
            SELECT id FROM expediente 
            WHERE visado_dgc IS NOT NULL 
            AND visado_dgc <= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            ORDER BY visado_dgc ASC
        `);

        // 5. Alertas de Presentación DGC (90 días)
        const alertasPresentacion = await query(`
            SELECT id FROM expediente 
            WHERE presentacion_dgc IS NOT NULL 
            AND presentacion_dgc <= DATE_SUB(NOW(), INTERVAL 90 DAY)
            ORDER BY presentacion_dgc ASC
        `);

        // Construir array de alertas
        const alertas: any[] = [];

        alertasVisado.rows.forEach((r: any) => {
            alertas.push({
                tipo: "Demora",
                descripcion: `Visado del expediente Nº ${r.id} cumplió los seis meses`,
                expedienteId: r.id.toString()
            });
        });

        alertasPresentacion.rows.forEach((r: any) => {
            alertas.push({
                tipo: "Demora",
                descripcion: `Presentación para previa de catastro del expediente Nº ${r.id} cumplió los 90 días`,
                expedienteId: r.id.toString()
            });
        });

        // 6. Alertas personalizadas del usuario
        const customAlerts = await query(`
            SELECT a.*, DATE_FORMAT(a.hora, '%H:%i') as hora_limpia, e.objeto as expediente_objeto 
            FROM alertas a 
            LEFT JOIN expediente e ON a.expediente_id = e.id 
            WHERE visto = 0 
            AND a.fecha <= DATE_ADD(NOW(), INTERVAL 7 DAY)
            ORDER BY a.fecha ASC, a.hora ASC
        `);

        customAlerts.rows.forEach((r: any) => {
            const fechaStr = new Date(r.fecha).toLocaleDateString("es-AR");
            alertas.push({
                id: r.id,
                tipo: "Recordatorio",
                descripcion: `${r.titulo}${r.expediente_objeto ? ` (Exp: ${r.expediente_objeto})` : ""}`,
                fecha: `${fechaStr}${r.hora_limpia ? ` ${r.hora_limpia}` : ""}`,
                notas: r.notas,
                esPersonalizada: true
            });
        });

        return {
            estadisticas: {
                total,
                terminados,
                enProceso,
                catastro,
                presupuesto,
                relevamiento
            },
            alertas: alertas,
            expedientesRecientes: recientesResult.rows.map((exp: any) => {
                // Lógica de Relevamiento
                let relevStatus: any = false;
                const totalRelev = Number(exp.relev_total || 0);
                const hechoRelev = Number(exp.relev_hecho || 0);

                if (totalRelev > 0) {
                    if (hechoRelev === totalRelev) {
                        relevStatus = true; // Todo hecho
                    } else if (hechoRelev > 0) {
                        relevStatus = "process"; // En proceso
                    }
                }

                // Presupuesto: Limpia espacios y convierte a número
                const rawP = String(exp.total_presupuesto || "0").trim();
                const totalP = parseFloat(rawP);
                const tieneP = !isNaN(totalP) && totalP > 0;

                return {
                    id: exp.id.toString(),
                    numero: exp.id.toString(),
                    cliente: exp.cliente_nombre || "Sin cliente",
                    terreno: exp.terreno_direccion || "Sin dirección",
                    ultimaActualizacion: exp.visado_dgc ? new Date(exp.visado_dgc).toISOString().split('T')[0] : "Pendiente",
                    etapasStatus: {
                        Presupuesto: tieneP,
                        Relevamiento: relevStatus,
                        Plano: !!exp.pdf_ploteo && exp.pdf_ploteo !== "No cargado" && exp.pdf_ploteo !== "ploteo_ejemplo.pdf",
                        "Previa DGC": !!exp.previa_dgc && exp.previa_dgc !== "-" && exp.previa_dgc !== "No cargado",
                        Certificado: (!!exp.certificado_catastral && exp.certificado_catastral !== "No cargado") || (!!exp.cert_terreno && exp.cert_terreno !== "No cargado"),
                        Visado: !!exp.visado_dgc,
                        Mojones: !!exp.campo1 && exp.campo1 !== "No cargado"
                    }
                };
            })
        };
    } catch (error) {
        console.error("Error en dashboardServicio:", error);
        throw error;
    }
};

export const obtenerExpedientesPorEtapa = async (etapa: string) => {
    let sql = "";
    let params: any[] = [];

    const baseQuery = `
        SELECT e.id, e.id as numero, c.nombre_completo as cliente, t.direccion as terreno
        FROM expediente e
        LEFT JOIN clientes c ON e.cliente_id = c.id
        LEFT JOIN terreno t ON e.terreno_id = t.id
    `;

    switch (etapa.toLowerCase()) {
        case "catastro":
            sql = `${baseQuery} WHERE e.presentacion_dgc IS NULL AND (c.activo = 1 OR c.id IS NULL)`;
            break;
        case "presupuesto":
            sql = `
                SELECT e.id, e.id as numero, c.nombre_completo as cliente, t.direccion as terreno
                FROM expediente e
                LEFT JOIN clientes c ON e.cliente_id = c.id
                LEFT JOIN terreno t ON e.terreno_id = t.id
                JOIN expediente_presupuesto p ON e.id = p.expediente_id
                WHERE (c.activo = 1 OR c.id IS NULL) AND p.total_a_pagar > 0
            `;
            break;
        case "relevamiento":
            sql = `
                SELECT DISTINCT e.id, e.id as numero, c.nombre_completo as cliente, t.direccion as terreno
                FROM expediente e
                LEFT JOIN clientes c ON e.cliente_id = c.id
                LEFT JOIN terreno t ON e.terreno_id = t.id
                JOIN expediente_presupuesto p ON e.id = p.expediente_id
                JOIN expediente_presupuesto_items i ON p.id = i.presupuesto_id
                WHERE i.realizado = 0 AND (c.activo = 1 OR c.id IS NULL)
            `;
            break;
        case "total":
            sql = `${baseQuery} WHERE (c.activo = 1 OR c.id IS NULL)`;
            break;
        case "terminados":
            sql = `${baseQuery} WHERE e.terminado = true AND (c.activo = 1 OR c.id IS NULL)`;
            break;
        case "en_proceso":
            sql = `${baseQuery} WHERE e.terminado = false AND (c.activo = 1 OR c.id IS NULL)`;
            break;
        default:
            // Para etapas no implementadas aún, devolvemos vacío para evitar errores
            return [];
    }

    const result = await query(sql, params);
    return result.rows.map(exp => ({
        ...exp,
        id: exp.id.toString(),
        numero: exp.numero.toString()
    }));
};

export const buscarExpedientes = async (termino: string) => {
    const t = `%${termino}%`;
    const result = await query(`
        SELECT e.*, c.nombre_completo as cliente_nombre,
               ep.total_a_pagar as total_presupuesto,
               (SELECT COUNT(*) FROM expediente_presupuesto_items epi WHERE epi.presupuesto_id = ep.id) as relev_total,
               (SELECT COUNT(*) FROM expediente_presupuesto_items epi WHERE epi.presupuesto_id = ep.id AND epi.realizado = 1) as relev_hecho,
               t.direccion as terreno_direccion,
               t.pdf_ploteo,
               t.cert_catastral as cert_terreno
        FROM expediente e 
        LEFT JOIN clientes c ON e.cliente_id = c.id 
        LEFT JOIN expediente_presupuesto ep ON e.id = ep.expediente_id
        LEFT JOIN terreno t ON e.terreno_id = t.id
        WHERE (c.activo = 1 OR c.id IS NULL) AND (e.id LIKE ? OR c.nombre_completo LIKE ? OR t.direccion LIKE ?) 
        LIMIT 10
    `, [t, t, t]);
    return result.rows.map((exp: any) => {
        let relevStatus: any = false;
        const totalRelev = Number(exp.relev_total || 0);
        const hechoRelev = Number(exp.relev_hecho || 0);

        if (totalRelev > 0) {
            if (hechoRelev === totalRelev) {
                relevStatus = true;
            } else if (hechoRelev > 0) {
                relevStatus = "process";
            }
        }

        const rawP = String(exp.total_presupuesto || "0").trim();
        const totalP = parseFloat(rawP);
        const tieneP = !isNaN(totalP) && totalP > 0;

        return {
            id: exp.id.toString(),
            numero: exp.id.toString(),
            cliente: exp.cliente_nombre || "Sin cliente",
            terreno: exp.terreno_direccion || "Sin dirección",
            etapasStatus: {
                Presupuesto: tieneP,
                Relevamiento: relevStatus,
                Plano: !!exp.pdf_ploteo && exp.pdf_ploteo !== "No cargado" && exp.pdf_ploteo !== "ploteo_ejemplo.pdf",
                "Previa DGC": !!exp.previa_dgc && exp.previa_dgc !== "-" && exp.previa_dgc !== "No cargado",
                Certificado: (!!exp.certificado_catastral && exp.certificado_catastral !== "No cargado") || (!!exp.cert_terreno && exp.cert_terreno !== "No cargado"),
                Visado: !!exp.visado_dgc,
                Mojones: !!exp.campo1 && exp.campo1 !== "No cargado"
            }
        };
    });
};

export const toggleEstadoCliente = async (clienteId: number, activo: boolean) => {
    return await query("UPDATE clientes SET activo = ? WHERE id = ?", [activo ? 1 : 0, clienteId]);
};
