import { Router } from "express";
import { query } from "../config/db";

const router = Router();

// Obtener todos los honorarios (categorías + servicios)
router.get("/", async (req, res) => {
    try {
        const categoriasResult = await query("SELECT * FROM honorarios_categorias ORDER BY orden, id");
        const categorias = categoriasResult.rows;

        for (const cat of categorias) {
            const serviciosResult = await query("SELECT * FROM honorarios_servicios WHERE categoria_id = ? ORDER BY orden, id", [cat.id]);
            cat.otros = cat.otros || "";
            cat.servicios = serviciosResult.rows.map((s: any) => ({
                id: s.id,
                codigo: s.codigo,
                nombre: s.nombre,
                montoBase: Number(s.monto_base),
                unidadBase: s.unidad_base,
                montoVariable: Number(s.monto_variable),
                unidadVariable: s.unidad_variable,
                montoVariable2: Number(s.monto_variable2),
                unidadVariable2: s.unidad_variable2,
                montoPorcentaje: Number(s.monto_porcentaje),
                porcentaje: Number(s.porcentaje),
                observaciones: s.observaciones,
                esTitulo: !!s.es_titulo
            }));
        }

        res.json(categorias);
    } catch (error) {
        console.error("Error al obtener honorarios:", error);
        res.status(500).json({ mensaje: "Error al obtener honorarios" });
    }
});

// Guardar/Actualizar categorías y servicios (Sincronización completa)
// Obtener notas generales
router.get("/notas", async (req, res) => {
    try {
        const result = await query("SELECT * FROM honorarios_notas ORDER BY orden, id");
        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener notas:", error);
        res.status(500).json({ mensaje: "Error al obtener notas" });
    }
});

// Guardar notas generales (Sincronización)
router.post("/notas", async (req, res) => {
    try {
        const notas = req.body; // Array de {id, contenido, orden}

        // Obtener IDs actuales para saber cuáles borrar
        const resultActual = await query("SELECT id FROM honorarios_notas");
        const idsActuales = resultActual.rows.map((r: any) => r.id);
        const idsNuevos = notas.filter((n: any) => n.id && n.id < 1000000).map((n: any) => n.id);

        const idsABorrar = idsActuales.filter(id => !idsNuevos.includes(id));
        if (idsABorrar.length > 0) {
            await query(`DELETE FROM honorarios_notas WHERE id IN (${idsABorrar.join(',')})`);
        }

        for (const nota of notas) {
            if (nota.id && nota.id < 1000000) {
                await query("UPDATE honorarios_notas SET contenido = ?, orden = ? WHERE id = ?", [nota.contenido, nota.orden, nota.id]);
            } else {
                await query("INSERT INTO honorarios_notas (contenido, orden) VALUES (?, ?)", [nota.contenido, nota.orden]);
            }
        }
        res.json({ mensaje: "Notas actualizadas con éxito" });
    } catch (error) {
        console.error("Error al actualizar notas:", error);
        res.status(500).json({ mensaje: "Error al actualizar notas" });
    }
});

router.post("/sincronizar", async (req, res) => {
    try {
        const categorias = req.body; // Array de categorías con servicios

        // Por simplicidad en este MVP, vamos a limpiar y re-insertar o actualizar.
        // Pero para ser más seguros, podemos manejarlo por ID.

        for (const cat of categorias) {
            if (cat.id && cat.id < 1000000) { // IDs reales vienen del DB. IDs temporales (Date.now()) son grandes.
                await query("UPDATE honorarios_categorias SET tipo = ?, otros = ? WHERE id = ?", [cat.tipo, cat.otros || "", cat.id]);
            } else {
                await query("INSERT INTO honorarios_categorias (tipo, otros) VALUES (?, ?)", [cat.tipo, cat.otros || ""]);
                const lastIdRes = await query("SELECT LAST_INSERT_ID() as id");
                cat.id = (lastIdRes.rows[0] as any).id;
            }

            // Servicios de la categoría
            // Borrar servicios que ya no están (si tenemos los IDs actuales sería mejor, pero por ahora borramos y reinsertamos si es necesario)
            // O mejor: si el servicio tiene ID, update. Si no, insert.
            const serviciosExistentesIdsResult = await query("SELECT id FROM honorarios_servicios WHERE categoria_id = ?", [cat.id]);
            const idsEnDb = serviciosExistentesIdsResult.rows.map((r: any) => r.id);
            const idsEnRequest = cat.servicios.filter((s: any) => s.id && s.id < 1000000).map((s: any) => s.id);

            const idsABorrar = idsEnDb.filter(id => !idsEnRequest.includes(id));
            if (idsABorrar.length > 0) {
                await query(`DELETE FROM honorarios_servicios WHERE id IN (${idsABorrar.join(',')})`);
            }

            for (const s of cat.servicios) {
                if (s.id && s.id < 1000000) {
                    await query(`
                        UPDATE honorarios_servicios SET 
                        codigo=?, nombre=?, monto_base=?, unidad_base=?, monto_variable=?, unidad_variable=?, monto_variable2=?, unidad_variable2=?, monto_porcentaje=?, porcentaje=?, observaciones=?, es_titulo=? 
                        WHERE id=?
                    `, [s.codigo, s.nombre, s.montoBase, s.unidadBase, s.montoVariable, s.unidadVariable, s.montoVariable2, s.unidadVariable2, s.montoPorcentaje, s.porcentaje, s.observaciones, s.esTitulo ? 1 : 0, s.id]);
                } else {
                    await query(`
                        INSERT INTO honorarios_servicios 
                        (categoria_id, codigo, nombre, monto_base, unidad_base, monto_variable, unidad_variable, monto_variable2, unidad_variable2, monto_porcentaje, porcentaje, observaciones, es_titulo) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `, [cat.id, s.codigo, s.nombre, s.montoBase, s.unidadBase, s.montoVariable, s.unidadVariable, s.montoVariable2, s.unidadVariable2, s.montoPorcentaje, s.porcentaje, s.observaciones, s.esTitulo ? 1 : 0]);
                }
            }
        }

        // Borrar categorías que no están en el request
        const idsCatsRequest = categorias.filter((c: any) => c.id && c.id < 1000000).map((c: any) => c.id);
        const catsExistentesResult = await query("SELECT id FROM honorarios_categorias");
        const idsCatsDb = catsExistentesResult.rows.map((r: any) => r.id);
        const idsCatsABorrar = idsCatsDb.filter(id => !idsCatsRequest.includes(id));

        if (idsCatsABorrar.length > 0) {
            await query(`DELETE FROM honorarios_categorias WHERE id IN (${idsCatsABorrar.join(',')})`);
        }

        res.json({ mensaje: "Honorarios sincronizados con éxito" });
    } catch (error) {
        console.error("Error al sincronizar honorarios:", error);
        res.status(500).json({ mensaje: "Error al sincronizar honorarios" });
    }
});

export default router;
