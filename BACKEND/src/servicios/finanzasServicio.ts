import { query } from "../config/db";

export const obtenerEstadisticasFinancieras = async (periodo: string = 'month') => {
    try {
        let dateFilter = "";
        let params: any[] = [];

        if (periodo === 'month') {
            dateFilter = " AND MONTH(FECHA_COL) = MONTH(NOW()) AND YEAR(FECHA_COL) = YEAR(NOW())";
        } else if (periodo === 'year') {
            dateFilter = " AND YEAR(FECHA_COL) = YEAR(NOW())";
        }

        // 1. Totales Generales (KPIs)
        const totalFacturadoResult = await query(`
            SELECT SUM(total_a_pagar) as total
            FROM expediente_presupuesto p
            JOIN expediente e ON p.expediente_id = e.id
            WHERE (1=1 ${dateFilter.replace(/FECHA_COL/g, 'e.fecha_presupuesto')})
        `);

        const totalCobradoResult = await query(`
            SELECT SUM(monto) as total
            FROM expediente_cuotas
            WHERE pagado = 1 ${dateFilter.replace(/FECHA_COL/g, 'fecha_pago')}
        `);

        // Deuda Total de Clientes (Pendiente de cobro acumulado)
        // Esto refleja la deuda real actual, independiente del periodo seleccionado.
        const totalPendienteResult = await query(`
            SELECT SUM(monto) as total
            FROM expediente_cuotas
            WHERE pagado = 0
        `);

        const totalFacturado = parseFloat(totalFacturadoResult.rows[0].total || 0);
        const totalCobrado = parseFloat(totalCobradoResult.rows[0].total || 0);
        const totalPendiente = parseFloat(totalPendienteResult.rows[0].total || 0);

        console.log(`[Finanzas] Periodo: ${periodo}, Facturado: ${totalFacturado}, Cobrado: ${totalCobrado}, Pendiente: ${totalPendiente}`);

        // 2. Desglose mensual de Cobranzas EFECTIVAS
        // Mostramos los últimos 12 meses con actividad para que no sea estático si no hay pagos este mes
        const cobranzaMensualResult = await query(`
            SELECT 
                DATE_FORMAT(fecha_pago, '%Y-%m') as mes,
                SUM(monto) as monto,
                COUNT(*) as cantidad_pagos
            FROM expediente_cuotas
            WHERE pagado = 1 AND fecha_pago IS NOT NULL
            GROUP BY mes
            ORDER BY mes ASC
            LIMIT 12
        `);

        // 3. Top Clientes con mayor deuda (Deudores) - Siempre actual
        const deudoresResult = await query(`
            SELECT 
                c.nombre_completo as cliente,
                SUM(cu.monto) as saldo_pendiente,
                COUNT(cu.id) as cuotas_pendientes
            FROM expediente_cuotas cu
            JOIN expediente_presupuesto p ON cu.presupuesto_id = p.id
            JOIN expediente e ON p.expediente_id = e.id
            JOIN clientes c ON e.cliente_id = c.id
            WHERE cu.pagado = 0
            GROUP BY c.id, c.nombre_completo
            ORDER BY saldo_pendiente DESC
            LIMIT 10
        `);

        // 4. Cobros recientes (Últimos 10 pagos recibidos)
        const ultimosCobrosResult = await query(`
            SELECT 
                c.nombre_completo as cliente,
                cu.monto,
                DATE_FORMAT(cu.fecha_pago, '%d/%m/%Y') as fecha,
                cu.numero as cuota_n
            FROM expediente_cuotas cu
            JOIN expediente_presupuesto p ON cu.presupuesto_id = p.id
            JOIN expediente e ON p.expediente_id = e.id
            JOIN clientes c ON e.cliente_id = c.id
            WHERE cu.pagado = 1
            ORDER BY cu.fecha_pago DESC
            LIMIT 10
        `);

        // 5. Mejores Clientes (Los que más han pagado en total)
        const mejoresClientesResult = await query(`
            SELECT 
                c.nombre_completo as cliente,
                SUM(cu.monto) as total_pagado
            FROM expediente_cuotas cu
            JOIN expediente_presupuesto p ON cu.presupuesto_id = p.id
            JOIN expediente e ON p.expediente_id = e.id
            JOIN clientes c ON e.cliente_id = c.id
            WHERE cu.pagado = 1
            GROUP BY c.id, c.nombre_completo
            ORDER BY total_pagado DESC
            LIMIT 10
        `);

        // 6. Items más rentables (Servicios)
        const serviciosRentablesResult = await query(`
            SELECT 
                nombre,
                COUNT(*) as cantidad,
                SUM(total_item) as total
            FROM expediente_presupuesto_items
            GROUP BY nombre
            ORDER BY total DESC
            LIMIT 5
        `);

        const response = {
            kpis: {
                totalFacturado,
                totalCobrado,
                totalPendiente,
                porcentajeCobrado: totalFacturado > 0 ? (totalCobrado / totalFacturado) * 100 : 0
            },
            graficos: {
                cobranzaMensual: cobranzaMensualResult.rows.map((r: any) => ({
                    ...r,
                    monto: parseFloat(r.monto || 0),
                    cantidad_pagos: Number(r.cantidad_pagos || 0)
                })),
                serviciosRentables: serviciosRentablesResult.rows.map((r: any) => ({
                    ...r,
                    cantidad: Number(r.cantidad || 0),
                    total: parseFloat(r.total || 0)
                })),
                deudores: deudoresResult.rows.map((r: any) => ({
                    ...r,
                    saldo_pendiente: parseFloat(r.saldo_pendiente || 0),
                    cuotas_pendientes: Number(r.cuotas_pendientes || 0)
                })),
                mejoresClientes: mejoresClientesResult.rows.map((r: any) => ({
                    ...r,
                    total_pagado: parseFloat(r.total_pagado || 0)
                }))
            },
            ultimosCobros: ultimosCobrosResult.rows.map((r: any) => ({
                ...r,
                monto: parseFloat(r.monto || 0),
                cuota_n: Number(r.cuota_n || 0)
            }))
        };

        return response;
    } catch (error) {
        console.error("Error en finanzasServicio:", error);
        throw error;
    }
};
