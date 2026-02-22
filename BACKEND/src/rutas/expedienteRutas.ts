import { Router } from "express";
import { query } from "../config/db";
import * as authServicio from "../servicios/authServicio";
import { generarPDFPersonalizado, generarFichaPDF } from "../servicios/pdfServicio";
import { generarPresupuestoDocx, generarPeticionCatastroDocx } from "../servicios/docxServicio";
import fs from 'fs';
import path from 'path';

const router = Router();

// Obtener todos los expedientes
router.get("/", async (req, res) => {
    try {
        const result = await query(`
            SELECT e.*, t.direccion as terreno_direccion, c.nombre_completo as cliente_nombre 
            FROM expediente e 
            LEFT JOIN terreno t ON e.terreno_id = t.id
            LEFT JOIN clientes c ON e.cliente_id = c.id 
            ORDER BY e.id DESC
        `);

        const data = result.rows.map((exp: any) => ({
            ...exp,
            id: exp.id.toString(),
            numero: exp.id.toString(),
            cliente: exp.cliente_nombre || "Sin cliente",
            terreno: exp.terreno_direccion || "Sin dirección",
            estado: exp.terminado ? "Finalizado" : "En Proceso",
            ultimaActualizacion: exp.visado_dgc ? new Date(exp.visado_dgc).toISOString().split('T')[0] : "Pendiente"
        }));

        res.json(data);
    } catch (error) {
        console.error("Error al obtener expedientes:", error);
        res.status(500).json({ mensaje: "Error al obtener expedientes" });
    }
});

// Obtener un expediente por ID (con todas sus tablas asociadas)
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Datos principales del expediente y cliente
        const expResult = await query(`
            SELECT e.*, 
                   t.direccion as terreno_direccion,
                   t.depto as terreno_depto,
                   t.municipio as terreno_municipio,
                   t.seccion as terreno_seccion,
                   t.chacra as terreno_chacra,
                   t.manzana as terreno_manzana,
                   t.parcela as terreno_parcela,
                   t.lote as terreno_lote,
                   t.superficie as terreno_superficie,
                   c.id as cliente_id,
                   c.nombre_completo as cliente_nombre,
                   c.dni_cuil as cliente_dni,
                   c.telefono as cliente_telefono,
                   c.email as cliente_email,
                   c.direccion as cliente_direccion,
                   c.localidad as cliente_localidad,
                   c.provincia as cliente_provincia,
                   (SELECT COUNT(*) FROM usuarios u WHERE u.expediente_id = e.id) as tiene_usuario
            FROM expediente e 
            LEFT JOIN terreno t ON e.terreno_id = t.id
            LEFT JOIN clientes c ON e.cliente_id = c.id 
            WHERE e.id = ?
        `, [id]);

        if (expResult.rows.length === 0) {
            return res.status(404).json({ mensaje: "Expediente no encontrado" });
        }

        const exp = expResult.rows[0];

        // 2. Datos de terreno
        const terrenoResult = await query("SELECT * FROM terreno WHERE id = ?", [exp.terreno_id]);
        const terreno = terrenoResult.rows[0] || {};

        // 3. Datos de firmante
        const firmanteResult = await query("SELECT * FROM expediente_firmante WHERE expediente_id = ?", [id]);
        const firmante = firmanteResult.rows[0] || {};

        // 4. Datos de presupuesto y sus items
        const presupuestoResult = await query("SELECT * FROM expediente_presupuesto WHERE expediente_id = ?", [id]);
        const presupuesto = presupuestoResult.rows[0] || { items: [] };

        if (presupuesto.id) {
            const itemsResult = await query("SELECT * FROM expediente_presupuesto_items WHERE presupuesto_id = ?", [presupuesto.id]);
            presupuesto.items = itemsResult.rows;

            // Cargar cuotas
            const cuotasResult = await query("SELECT * FROM expediente_cuotas WHERE presupuesto_id = ? ORDER BY numero", [presupuesto.id]);
            presupuesto.cuotas = cuotasResult.rows;
        } else {
            presupuesto.items = [];
            presupuesto.cuotas = [];
        }

        const data = {
            ...exp,
            // Re-mapear campos del terreno al objeto principal para mantener compatibilidad con la UI
            direccion: exp.terreno_direccion,
            depto: exp.terreno_depto,
            municipio: exp.terreno_municipio,
            seccion: exp.terreno_seccion,
            chacra: exp.terreno_chacra,
            manzana: exp.terreno_manzana,
            parcela: exp.terreno_parcela,
            lote: exp.terreno_lote,
            superficie: exp.terreno_superficie,
            id: exp.id.toString(),
            numero: exp.id.toString(),
            cliente: exp.cliente_nombre || "Sin cliente",
            cliente_dni: exp.cliente_dni || "",
            cliente_telefono: exp.cliente_telefono || "",
            cliente_email: exp.cliente_email || "",
            cliente_direccion: exp.cliente_direccion || "",
            cliente_localidad: exp.cliente_localidad || "",
            cliente_provincia: exp.cliente_provincia || "",
            cliente_id: exp.cliente_id,
            terreno_detalle: terreno,
            firmante_detalle: firmante,
            presupuesto_detalle: presupuesto,
            // Compatibilidad UI
            estado: exp.terminado ? "Finalizado" : "En Proceso",
            ultimaActualizacion: exp.visado_dgc ? new Date(exp.visado_dgc).toISOString().split('T')[0] : "Pendiente"
        };

        res.json(data);
    } catch (error) {
        console.error("Error al obtener expediente:", error);
        res.status(500).json({ mensaje: "Error al obtener expediente" });
    }
});

// Crear un nuevo expediente
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        let clienteId = body.cliente_id;

        // 1. Si es un nuevo cliente, crearlo
        if (body.nuevo_cliente) {
            const nc = body.nuevo_cliente;
            await query(`INSERT INTO clientes (nombre_completo, dni_cuil, telefono, email, direccion, localidad, provincia) VALUES (?,?,?,?,?,?,?)`,
                [
                    nc.nombre || "No cargado",
                    nc.dni || "No cargado",
                    nc.telefono || "No cargado",
                    nc.email || null,
                    nc.direccion || "No cargado",
                    nc.localidad || null,
                    nc.provincia || null
                ]);
            const resId = await query("SELECT LAST_INSERT_ID() as id");
            clienteId = resId.rows[0].id;
        }

        // 2. Insertar Terreno primero para obtener su ID
        let terrenoId = null;
        const t = body.terreno_detalle || {};
        await query(`INSERT INTO terreno (
                direccion, depto, municipio, seccion, chacra, manzana, parcela, lote,
                designacion, latitud, longitud, superficie, pdf_ploteo, cert_catastral
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                body.direccion || null,
                body.depto || null,
                body.municipio || 0,
                body.seccion || 0,
                body.chacra || 0,
                body.manzana || 0,
                body.parcela || null,
                body.lote || null,
                t.designacion || "No cargado",
                t.latitud || -27.367,
                t.longitud || -55.896,
                t.superficie || null,
                t.pdf_ploteo || "No cargado",
                t.cert_catastral || "No cargado"
            ]);
        const resTer = await query("SELECT LAST_INSERT_ID() as id");
        terrenoId = resTer.rows[0].id;

        // 3. Insertar Expediente principal
        const resExp = await query(`
            INSERT INTO expediente (
                cliente_id, terreno_id, 
                partida_inmobiliaria, objeto, fecha_relevamiento, fecha_presentacion_municipalidad, 
                expte_muni, certificado_catastral, informe_dominial, titular, responsable, 
                fecha_presupuesto, falta_relevar, importe_presupuesto, 
                entrega, fecha_libre_deuda, aprobacion_muni, disposicion_n, presentacion_dgc, 
                expediente_n, previa_dgc, definitiva_dgc, visado_dgc, plano_registrado, 
                correccion, campo1, terminado, notas, materiales, fecha_apertura,
                pdf_catastro_file, cert_catastral_file
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                clienteId,
                terrenoId,
                body.partida_inmobiliaria || null,
                body.objeto || null,
                body.fecha_relevamiento || null,
                body.fecha_presentacion_municipalidad || null,
                body.expte_muni || null,
                body.certificado_catastral || null,
                body.informe_dominial || null,
                body.titular || null,
                body.responsable || null,
                body.fecha_presupuesto || null,
                body.falta_relevar ? 1 : 0,
                body.importe_presupuesto || 0,
                body.entrega ? 1 : 0,
                body.fecha_libre_deuda || null,
                body.aprobacion_muni ? 1 : 0,
                body.disposicion_n || null,
                body.presentacion_dgc || null,
                body.expediente_n || null,
                body.previa_dgc || null,
                body.definitiva_dgc || null,
                body.visado_dgc || null,
                body.plano_registrado ? 1 : 0,
                body.correccion ? 1 : 0,
                body.campo1 || null,
                body.terminado ? 1 : 0,
                body.notas || null,
                body.materiales || null,
                body.fecha_apertura || null,
                body.pdf_catastro_file || null,
                body.cert_catastral_file || null
            ]
        );
        const resIdExp = await query("SELECT LAST_INSERT_ID() as id");
        const id = resIdExp.rows[0].id;

        // 4. Actualizar Terreno con el expediente_id (para compatibilidad inversa si es necesario)
        await query(`UPDATE terreno SET expediente_id = ? WHERE id = ?`, [id, terrenoId]);

        // 5. Insertar Firmante
        if (body.firmante_detalle) {
            const f = body.firmante_detalle;
            await query(`INSERT INTO expediente_firmante (expediente_id, tipo_firmante, libre_deuda, dni_titular, dni_poseedor, dni_responsable, escribano, cuil_empresa, doc_firmante) VALUES (?,?,?,?,?,?,?,?,?)`,
                [id, f.tipo_firmante || "PersonaFisica", f.libre_deuda ? 1 : 0, f.dni_titular ? 1 : 0, f.dni_poseedor ? 1 : 0, f.dni_responsable ? 1 : 0, f.escribano ? 1 : 0, f.cuil_empresa ? 1 : 0, f.doc_firmante || "No cargado"]);
        }

        // 5. Insertar Presupuesto
        if (body.presupuesto_detalle) {
            const p = body.presupuesto_detalle;
            await query(`INSERT INTO expediente_presupuesto (expediente_id, tiempo_ejecucion, requisitos, senas, subtotal_servicios, total_a_pagar, cantidad_cuotas, cuotas_iguales) VALUES (?,?,?,?,?,?,?,?)`,
                [id, p.tiempo_ejecucion || "No cargado", p.requisitos || "No cargado", p.senas || 0, p.subtotal_servicios || 0, p.total_a_pagar || 0, p.cantidad_cuotas || 1, p.cuotas_iguales ? 1 : 0]);

            const resIdP = await query("SELECT LAST_INSERT_ID() as id");
            const presupuestoId = resIdP.rows[0].id;

            // Items
            if (p.items && p.items.length > 0) {
                for (const item of p.items) {
                    await query(`INSERT INTO expediente_presupuesto_items (presupuesto_id, servicio_id, nombre, monto_base, unidad_base, monto_variable, unidad_variable, cantidad_variable, monto_variable2, unidad_variable2, cantidad_variable2, monto_porcentaje, porcentaje, total_item) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                        [presupuestoId, item.servicio_id, item.nombre || "No cargado", item.monto_base || 0, item.unidad_base || "No cargado", item.monto_variable || 0, item.unidad_variable || "No cargado", item.cantidad_variable || 0, item.monto_variable2 || 0, item.unidad_variable2 || "No cargado", item.cantidad_variable2 || 0, item.monto_porcentaje || 0, item.porcentaje || 0, item.total_item || 0]);
                }
            }

            // Cuotas
            if (p.cuotas && p.cuotas.length > 0) {
                for (const c of p.cuotas) {
                    await query(`INSERT INTO expediente_cuotas (presupuesto_id, numero, monto, pagado) VALUES (?,?,?,?)`,
                        [presupuestoId, c.numero, c.monto || 0, c.pagado ? 1 : 0]);
                }
            }
        }

        // 6. Si se solicitó crear usuario, enviar invitación
        if (body.crear_usuario) {
            let emailInvitacion = body.email_acceso || null;
            let nombreInvitacion = "Cliente";

            if (body.nuevo_cliente) {
                if (!emailInvitacion) emailInvitacion = body.nuevo_cliente.email;
                nombreInvitacion = body.nuevo_cliente.nombre;
            } else if (clienteId) {
                // Si es cliente existente, buscar su email si no tenemos uno
                const resCli = await query("SELECT email, nombre_completo FROM clientes WHERE id = ?", [clienteId]);
                if (resCli.rows.length > 0) {
                    if (!emailInvitacion) emailInvitacion = resCli.rows[0].email;
                    nombreInvitacion = resCli.rows[0].nombre_completo;
                }
            }

            if (emailInvitacion) {
                // No esperamos a que termine para no demorar la respuesta del API
                authServicio.sendInvitationEmail(emailInvitacion, id, nombreInvitacion);
            }
        }

        res.json({ id, mensaje: "Expediente creado correctamente" });
    } catch (error) {
        console.error("Error al crear expediente:", error);
        res.status(500).json({ mensaje: "Error al crear expediente" });
    }
});


// Actualizar un expediente (Incluye sub-tablas)
router.put("/:id", async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const body = req.body;

        // Función auxiliar para limpiar números y evitar NaN
        const cleanNum = (val: any) => {
            if (val === null || val === undefined || val === "" || val === "-") return null;
            const res = Number(val);
            return isNaN(res) ? null : res;
        };

        const cleanDate = (val: any) => {
            if (!val || val === "-" || val === "S/D") return null;
            if (typeof val === 'string' && val.includes('T')) {
                return val.split('T')[0];
            }
            return val;
        };

        try {
            const logMsg = `\n[${new Date().toISOString()}] PUT /${id} RECEIVED. Payload keys: ${Object.keys(body).join(', ')}`;
            require('fs').appendFileSync('C:/agri/agrimensura/sis_agrimensura/BACKEND/debug_server.log', logMsg);
        } catch (e) { console.error("Log error", e); }

        // 0. Actualizar datos del cliente si se proporcionan
        if (body.cliente_id) {
            await query(
                `UPDATE clientes SET nombre_completo = ?, dni_cuil = ?, telefono = ?, email = ?, direccion = ?, localidad = ?, provincia = ? WHERE id = ?`,
                [
                    body.cliente,
                    body.cliente_dni,
                    body.cliente_telefono,
                    body.cliente_email || null,
                    body.cliente_direccion || null,
                    body.cliente_localidad || null,
                    body.cliente_provincia || null,
                    body.cliente_id
                ]
            );
        }

        const t = body.terreno_detalle || {};

        // 1. Actualizar tabla principal 'expediente'
        const sqlExp = `UPDATE expediente SET 
                objeto = ?, 
                partida_inmobiliaria = ?,
                expte_muni = ?, 
                certificado_catastral = ?, 
                informe_dominial = ?,
                cliente = ?, 
                titular = ?, 
                responsable = ?, 
                importe_presupuesto = ?, 
                terminado = ?,
                notas = ?, 
                materiales = ?, 
                fecha_apertura = ?,
                fecha_relevamiento = ?, 
                fecha_presentacion_municipalidad = ?,
                presentacion_dgc = ?, 
                previa_dgc = ?, 
                definitiva_dgc = ?, 
                visado_dgc = ?,
                expediente_n = ?, 
                notas_relevamiento = ?,
                aprobacion_muni = ?,
                disposicion_n = ?,
                fecha_presupuesto = ?,
                falta_relevar = ?,
                entrega = ?,
                plano_registrado = ?,
                correccion = ?,
                campo1 = ?,
                fecha_ingreso_dominio = ?,
                fecha_egreso_dominio = ?,
                mojones = ?,
                fecha_mojones = ?
             WHERE id = ?`;

        const paramsExp = [
            body.objeto || null,
            body.partida_inmobiliaria || null,
            body.expte_muni || null,
            body.certificado_catastral || null,
            body.informe_dominial || null,
            body.cliente || null,
            body.cliente || body.titular || null,
            body.responsable || null,
            cleanNum(body.importe_presupuesto) || 0,
            body.terminado ? 1 : 0,
            body.notas || null,
            body.materiales || null,
            cleanDate(body.fecha_apertura),
            cleanDate(body.fecha_relevamiento),
            cleanDate(body.fecha_presentacion_municipalidad),
            cleanDate(body.presentacion_dgc),
            cleanDate(body.previa_dgc),
            cleanDate(body.definitiva_dgc),
            cleanDate(body.visado_dgc),
            body.expediente_n || null,
            body.notas_relevamiento || null,
            body.aprobacion_muni ? 1 : 0,
            body.disposicion_n || null,
            cleanDate(body.fecha_presupuesto),
            body.falta_relevar ? 1 : 0,
            body.entrega ? 1 : 0,
            body.plano_registrado ? 1 : 0,
            body.correccion ? 1 : 0,
            body.campo1 || null,
            cleanDate(body.fecha_ingreso_dominio),
            cleanDate(body.fecha_egreso_dominio),
            body.mojones ? 1 : 0,
            cleanDate(body.fecha_mojones),
            id
        ];

        console.log("DEBUG: Executing main UPDATE for expediente", id);
        await query(sqlExp, paramsExp);

        // 2. Actualizar Terreno
        const expData = await query("SELECT terreno_id FROM expediente WHERE id = ?", [id]);
        let terrenoId = expData.rows[0]?.terreno_id;

        if (terrenoId) {
            console.log("DEBUG: Updating existing Terreno", terrenoId);
            await query(`UPDATE terreno SET 
                direccion = ?, depto = ?, municipio = ?, seccion = ?, chacra = ?, 
                manzana = ?, parcela = ?, lote = ?,
                designacion = ?, latitud = ?, longitud = ?, superficie = ?, pdf_catastro = ?, pdf_ploteo = ?, cert_catastral = ?
                WHERE id = ?`,
                [
                    body.direccion || body.ubicacion || t.direccion || null,
                    body.depto || t.depto || null,
                    cleanNum(body.municipio || t.municipio),
                    cleanNum(body.seccion || t.seccion),
                    cleanNum(body.chacra || t.chacra),
                    cleanNum(body.manzana || t.manzana),
                    body.parcela || t.parcela || null,
                    body.lote || t.lote || null,
                    t.designacion || body.terreno || null,
                    cleanNum(t.latitud),
                    cleanNum(t.longitud),
                    t.superficie || body.superficie || null,
                    t.pdf_catastro || null,
                    t.pdf_ploteo || null,
                    t.cert_catastral || null,
                    terrenoId
                ]);
        } else {
            console.log("DEBUG: Creating new Terreno for expediente", id);
            await query(`INSERT INTO terreno (
                expediente_id, direccion, depto, municipio, seccion, chacra, manzana, parcela, lote,
                designacion, latitud, longitud, superficie, pdf_catastro, pdf_ploteo, cert_catastral
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                    id,
                    body.direccion || body.ubicacion || t.direccion || null,
                    body.depto || t.depto || null,
                    cleanNum(body.municipio || t.municipio),
                    cleanNum(body.seccion || t.seccion),
                    cleanNum(body.chacra || t.chacra),
                    cleanNum(body.manzana || t.manzana),
                    body.parcela || t.parcela || null,
                    body.lote || t.lote || null,
                    t.designacion || body.terreno || null,
                    cleanNum(t.latitud),
                    cleanNum(t.longitud),
                    t.superficie || body.superficie || null,
                    t.pdf_catastro || null,
                    t.pdf_ploteo || null,
                    t.cert_catastral || null
                ]);
            const resTer = await query("SELECT LAST_INSERT_ID() as id");
            terrenoId = resTer.rows[0].id;
            await query("UPDATE expediente SET terreno_id = ? WHERE id = ?", [terrenoId, id]);
        }

        // 3. Actualizar o Insertar Firmante
        if (body.firmante_detalle) {
            console.log("DEBUG: Updating firmante for expediente", id);
            const f = body.firmante_detalle;
            const exists = await query("SELECT id FROM expediente_firmante WHERE expediente_id = ?", [id]);
            if (exists.rows.length > 0) {
                await query(`UPDATE expediente_firmante SET tipo_firmante=?, libre_deuda=?, dni_titular=?, dni_poseedor=?, dni_responsable=?, escribano=?, cuil_empresa=?, doc_firmante=? WHERE expediente_id=?`,
                    [f.tipo_firmante, f.libre_deuda ? 1 : 0, f.dni_titular ? 1 : 0, f.dni_poseedor ? 1 : 0, f.dni_responsable ? 1 : 0, f.escribano ? 1 : 0, f.cuil_empresa ? 1 : 0, f.doc_firmante, id]);
            } else {
                await query(`INSERT INTO expediente_firmante (expediente_id, tipo_firmante, libre_deuda, dni_titular, dni_poseedor, dni_responsable, escribano, cuil_empresa, doc_firmante) VALUES (?,?,?,?,?,?,?,?,?)`,
                    [id, f.tipo_firmante, f.libre_deuda ? 1 : 0, f.dni_titular ? 1 : 0, f.dni_poseedor ? 1 : 0, f.dni_responsable ? 1 : 0, f.escribano ? 1 : 0, f.cuil_empresa ? 1 : 0, f.doc_firmante]);
            }
        }

        // 4. Actualizar Presupuesto
        if (body.presupuesto_detalle) {
            console.log("DEBUG: Updating presupuesto for expediente", id);
            const p = body.presupuesto_detalle;
            let presupuestoId;
            const exists = await query("SELECT id FROM expediente_presupuesto WHERE expediente_id = ?", [id]);
            if (exists.rows.length > 0) {
                presupuestoId = exists.rows[0].id;
                const cantidadCuotasReal = (p.cuotas && p.cuotas.length > 0) ? p.cuotas.length : (cleanNum(p.cantidad_cuotas) || 1);
                await query(`UPDATE expediente_presupuesto SET tiempo_ejecucion=?, requisitos=?, senas=?, subtotal_servicios=?, total_a_pagar=?, cantidad_cuotas=?, cuotas_iguales=? WHERE id=?`,
                    [p.tiempo_ejecucion, p.requisitos, cleanNum(p.senas), cleanNum(p.subtotal_servicios), cleanNum(p.total_a_pagar), cantidadCuotasReal, p.cuotas_iguales ? 1 : 0, presupuestoId]);
            } else {
                const cantidadCuotasReal = (p.cuotas && p.cuotas.length > 0) ? p.cuotas.length : (cleanNum(p.cantidad_cuotas) || 1);
                await query(`INSERT INTO expediente_presupuesto (expediente_id, tiempo_ejecucion, requisitos, senas, subtotal_servicios, total_a_pagar, cantidad_cuotas, cuotas_iguales) VALUES (?,?,?,?,?,?,?,?)`,
                    [id, p.tiempo_ejecucion, p.requisitos, cleanNum(p.senas), cleanNum(p.subtotal_servicios), cleanNum(p.total_a_pagar), cantidadCuotasReal, p.cuotas_iguales ? 1 : 0]);
                const newP = await query("SELECT id FROM expediente_presupuesto WHERE expediente_id = ?", [id]);
                presupuestoId = newP.rows[0].id;
            }

            // Actualizar Items
            console.log("DEBUG: Updating presupuesto items for presupuesto", presupuestoId);
            await query("DELETE FROM expediente_presupuesto_items WHERE presupuesto_id = ?", [presupuestoId]);
            if (p.items && p.items.length > 0) {
                for (const item of p.items) {
                    await query(`INSERT INTO expediente_presupuesto_items (presupuesto_id, servicio_id, nombre, monto_base, unidad_base, monto_variable, unidad_variable, cantidad_variable, monto_variable2, unidad_variable2, cantidad_variable2, monto_porcentaje, porcentaje, total_item, realizado, fecha_realizacion) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                        [presupuestoId, cleanNum(item.servicio_id), item.nombre, cleanNum(item.monto_base), item.unidad_base, cleanNum(item.monto_variable), item.unidad_variable, cleanNum(item.cantidad_variable), cleanNum(item.monto_variable2), item.unidad_variable2, cleanNum(item.cantidad_variable2), cleanNum(item.monto_porcentaje), cleanNum(item.porcentaje), cleanNum(item.total_item), item.realizado ? 1 : 0, cleanDate(item.fecha_realizacion)]);
                }
            }

            // Actualizar Cuotas
            console.log("DEBUG: Updating cuotas for presupuesto", presupuestoId);
            await query("DELETE FROM expediente_cuotas WHERE presupuesto_id = ?", [presupuestoId]);
            if (p.cuotas && p.cuotas.length > 0) {
                for (const c of p.cuotas) {
                    await query(`INSERT INTO expediente_cuotas (presupuesto_id, numero, monto, pagado, fecha_pago) VALUES (?,?,?,?,?)`,
                        [presupuestoId, cleanNum(c.numero), cleanNum(c.monto), c.pagado ? 1 : 0, c.pagado ? cleanDate(c.fecha_pago || new Date()) : null]);
                }
            }
        }

        res.json({ success: true, mensaje: "Expediente actualizado correctamente" });
    } catch (error: any) {
        console.error("Error al actualizar expediente:", error);
        res.status(500).json({ success: false, mensaje: "Error al actualizar expediente", error: error.message });
    }
});

// Generar PDF personalizado
router.get("/:id/pdf-personalizado", async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Obtener datos completos del expediente
        const expResult = await query(`
            SELECT e.*, 
                   c.nombre_completo as cliente_nombre,
                   c.dni_cuil as cliente_dni,
                   c.telefono as cliente_telefono
            FROM expediente e 
            LEFT JOIN clientes c ON e.cliente_id = c.id 
            WHERE e.id = ?
        `, [id]);

        if (expResult.rows.length === 0) {
            return res.status(404).json({ mensaje: "Expediente no encontrado" });
        }

        const exp = expResult.rows[0];

        // 2. Cargar sub-tablas para el mapeo
        const itemsResult = await query("SELECT * FROM expediente_presupuesto_items WHERE presupuesto_id = (SELECT id FROM expediente_presupuesto WHERE expediente_id = ?)", [id]);
        const presupuestoResult = await query("SELECT * FROM expediente_presupuesto WHERE expediente_id = ?", [id]);
        const cuotasResult = await query("SELECT * FROM expediente_cuotas WHERE presupuesto_id = (SELECT id FROM expediente_presupuesto WHERE expediente_id = ?)", [id]);

        const datos = {
            ...exp,
            presupuesto_detalle: {
                ...presupuestoResult.rows[0],
                items: itemsResult.rows,
                cuotas: cuotasResult.rows
            }
        };

        // 3. Generar PDF
        const pdfBytes = await generarPDFPersonalizado(datos);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=presupuesto_${id}.pdf`);
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        console.error("Error al generar PDF:", error);
        res.status(500).json({ mensaje: "Error al generar el PDF personalizado" });
    }
});

// Generar Presupuesto en Word (DOCX) - Soporta GET y POST para ediciones
router.all("/:id/presupuesto-docx", async (req, res) => {
    try {
        const { id } = req.params;
        const overrides = req.method === "POST" ? req.body : {};

        // 1. Obtener datos completos
        const expResult = await query(`
            SELECT e.*, 
                   c.nombre_completo as cliente_nombre,
                   c.dni_cuil as cliente_dni,
                   c.telefono as cliente_telefono
            FROM expediente e 
            LEFT JOIN clientes c ON e.cliente_id = c.id 
            WHERE e.id = ?
        `, [id]);

        if (expResult.rows.length === 0) return res.status(404).json({ mensaje: "Expediente no encontrado" });
        const exp = expResult.rows[0];

        const itemsResult = await query("SELECT * FROM expediente_presupuesto_items WHERE presupuesto_id = (SELECT id FROM expediente_presupuesto WHERE expediente_id = ?)", [id]);
        const presupuestoResult = await query("SELECT * FROM expediente_presupuesto WHERE expediente_id = ?", [id]);
        const cuotasResult = await query("SELECT * FROM expediente_cuotas WHERE presupuesto_id = (SELECT id FROM expediente_presupuesto WHERE expediente_id = ?)", [id]);

        const datos = {
            ...exp,
            presupuesto_detalle: {
                ...presupuestoResult.rows[0],
                items: itemsResult.rows,
                cuotas: cuotasResult.rows
            }
        };

        // 2. Generar DOCX (pasando overrides si existen)
        const docxBuffer = await generarPresupuestoDocx(datos, overrides);

        // --- GUARDAR EN SERVIDOR ---
        try {
            // Definir ruta de salida: ../pdf/presupuestoXexpediente/
            // process.cwd() en ejecución normal es BACKEND/, así que subimos un nivel a la raíz del proyecto
            const outputDir = path.join(process.cwd(), '..', 'pdf', 'presupuestoXexpediente');

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // Nombre del archivo con timestamp para historial
            const fechaHora = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `presupuesto_exp_${id}_${fechaHora}.docx`;
            const filePath = path.join(outputDir, filename);

            fs.writeFileSync(filePath, Buffer.from(docxBuffer));
            console.log(`Presupuesto guardado en: ${filePath}`);
        } catch (saveError) {
            console.error("Error al guardar copia del presupuesto en servidor:", saveError);
            // No bloqueamos la respuesta al cliente si falla el guardado en disco, pero lo logueamos
        }
        // ---------------------------

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename=presupuesto_${id}.docx`);
        res.send(docxBuffer);
    } catch (error) {
        console.error("Error al generar DOCX:", error);
        res.status(500).json({ mensaje: "Error al generar el presupuesto en Word" });
    }
});

// Verificar si existe un presupuesto generado previamente
router.get("/:id/ultimo-presupuesto", async (req, res) => {
    try {
        const { id } = req.params;
        // Subimos un nivel desde la carpeta de ejecución de BACKEND
        const dirPath = path.join(process.cwd(), '..', 'pdf', 'presupuestoXexpediente');

        if (!fs.existsSync(dirPath)) {
            return res.json({ existe: false });
        }

        const files = fs.readdirSync(dirPath);
        // Prefijo esperado: presupuesto_exp_123_2023...
        const prefix = `presupuesto_exp_${id}_`;

        const budgetFiles = files
            .filter(f => f.startsWith(prefix) && f.endsWith('.docx'))
            // Ordenar por fecha de modificación, el más reciente primero
            .sort((a, b) => {
                return fs.statSync(path.join(dirPath, b)).mtime.getTime() -
                    fs.statSync(path.join(dirPath, a)).mtime.getTime();
            });

        if (budgetFiles.length > 0) {
            const lastFile = budgetFiles[0];
            const stats = fs.statSync(path.join(dirPath, lastFile));
            res.json({
                existe: true,
                filename: lastFile,
                fecha: stats.mtime.toLocaleString("es-AR")
            });
        } else {
            res.json({ existe: false });
        }
    } catch (error) {
        console.error("Error al buscar último presupuesto:", error);
        res.status(500).json({ mensaje: "Error al buscar presupuesto" });
    }
});

// Descargar el último presupuesto generado
router.get("/:id/descargar-ultimo-presupuesto", async (req, res) => {
    try {
        const { id } = req.params;
        const dirPath = path.join(process.cwd(), '..', 'pdf', 'presupuestoXexpediente');

        if (!fs.existsSync(dirPath)) {
            return res.status(404).json({ mensaje: "No hay presupuestos guardados" });
        }

        const files = fs.readdirSync(dirPath);
        const prefix = `presupuesto_exp_${id}_`;

        const budgetFiles = files
            .filter(f => f.startsWith(prefix) && f.endsWith('.docx'))
            .sort((a, b) => {
                return fs.statSync(path.join(dirPath, b)).mtime.getTime() -
                    fs.statSync(path.join(dirPath, a)).mtime.getTime();
            });

        if (budgetFiles.length === 0) {
            return res.status(404).json({ mensaje: "No se encontró presupuesto para este expediente" });
        }

        const filePath = path.join(dirPath, budgetFiles[0]);
        res.download(filePath);
    } catch (error) {
        console.error("Error al descargar último presupuesto:", error);
        res.status(500).json({ mensaje: "Error al descargar el archivo" });
    }
});

// Generar Ficha en PDF (Texto formal)
router.get("/:id/ficha-pdf", async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Obtener datos completos
        const expResult = await query(`
            SELECT e.*, 
                   t.*,
                   t.direccion as terreno_direccion,
                   c.nombre_completo as cliente_nombre,
                   c.dni_cuil as cliente_dni,
                   c.telefono as cliente_telefono
            FROM expediente e 
            LEFT JOIN terreno t ON e.terreno_id = t.id
            LEFT JOIN clientes c ON e.cliente_id = c.id 
            WHERE e.id = ?
        `, [id]);

        if (expResult.rows.length === 0) return res.status(404).json({ mensaje: "Expediente no encontrado" });
        const exp = expResult.rows[0];

        const itemsResult = await query("SELECT * FROM expediente_presupuesto_items WHERE presupuesto_id = (SELECT id FROM expediente_presupuesto WHERE expediente_id = ?)", [id]);
        const presupuestoResult = await query("SELECT * FROM expediente_presupuesto WHERE expediente_id = ?", [id]);
        const firmanteResult = await query("SELECT * FROM expediente_firmante WHERE expediente_id = ?", [id]);

        const datos = {
            ...exp,
            firmante_detalle: firmanteResult.rows[0],
            presupuesto_detalle: {
                ...presupuestoResult.rows[0],
                items: itemsResult.rows
            }
        };

        // 2. Generar PDF
        const pdfBytes = await generarFichaPDF(datos);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=ficha_${id}.pdf`);
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        console.error("Error al generar Ficha PDF:", error);
        res.status(500).json({ mensaje: "Error al generar la ficha en PDF" });
    }
});


// Generar Petición Catastro en Word (DOCX)
router.all("/:id/peticion-catastro-docx", async (req, res) => {
    try {
        const { id } = req.params;
        const overrides = req.method === "POST" ? req.body : {};

        // 1. Obtener datos completos
        const expResult = await query(`
            SELECT e.*, 
                   c.nombre_completo as cliente_nombre,
                   c.dni_cuil as cliente_dni,
                   c.telefono as cliente_telefono,
                   c.direccion as cliente_direccion,
                   t.depto, t.municipio, t.seccion, t.chacra, t.manzana, t.parcela, t.lote
            FROM expediente e 
            LEFT JOIN clientes c ON e.cliente_id = c.id 
            LEFT JOIN terreno t ON e.terreno_id = t.id
            WHERE e.id = ?
        `, [id]);

        if (expResult.rows.length === 0) return res.status(404).json({ mensaje: "Expediente no encontrado" });
        const exp = expResult.rows[0];

        // 2. Generar DOCX
        const docxBuffer = await generarPeticionCatastroDocx(exp, overrides);

        // --- GUARDAR EN SERVIDOR ---
        try {
            const outputDir = path.join(process.cwd(), '..', 'pdf', 'peticionDgcXexpte');

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            const fechaHora = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `peticion_catastro_exp_${id}_${fechaHora}.docx`;
            const filePath = path.join(outputDir, filename);

            fs.writeFileSync(filePath, Buffer.from(docxBuffer));
            console.log(`Petición Catastro guardada en: ${filePath}`);
        } catch (saveError) {
            console.error("Error al guardar copia de la petición en servidor:", saveError);
        }
        // ---------------------------

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename=peticion_catastro_${id}.docx`);
        res.send(docxBuffer);
    } catch (error) {
        console.error("Error al generar Petición Catastro DOCX:", error);
        res.status(500).json({ mensaje: "Error al generar la petición en Word" });
    }
});

// Verificar si existe una petición de catastro generada previamente
router.get("/:id/ultima-peticion-catastro", async (req, res) => {
    try {
        const { id } = req.params;
        const dirPath = path.join(process.cwd(), '..', 'pdf', 'peticionDgcXexpte');

        if (!fs.existsSync(dirPath)) {
            return res.json({ existe: false });
        }

        const files = fs.readdirSync(dirPath);
        const prefix = `peticion_catastro_exp_${id}_`;

        const peticionFiles = files
            .filter(f => f.startsWith(prefix) && f.endsWith('.docx'))
            .sort((a, b) => {
                return fs.statSync(path.join(dirPath, b)).mtime.getTime() -
                    fs.statSync(path.join(dirPath, a)).mtime.getTime();
            });

        if (peticionFiles.length > 0) {
            const lastFile = peticionFiles[0];
            const stats = fs.statSync(path.join(dirPath, lastFile));
            res.json({
                existe: true,
                filename: lastFile,
                fecha: stats.mtime.toLocaleString("es-AR")
            });
        } else {
            res.json({ existe: false });
        }
    } catch (error) {
        console.error("Error al buscar última petición:", error);
        res.status(500).json({ mensaje: "Error al buscar petición" });
    }
});

// Descargar la última petición de catastro generada
router.get("/:id/descargar-ultima-peticion-catastro", async (req, res) => {
    try {
        const { id } = req.params;
        const dirPath = path.join(process.cwd(), '..', 'pdf', 'peticionDgcXexpte');

        if (!fs.existsSync(dirPath)) {
            return res.status(404).json({ mensaje: "No hay peticiones guardadas" });
        }

        const files = fs.readdirSync(dirPath);
        const prefix = `peticion_catastro_exp_${id}_`;

        const peticionFiles = files
            .filter(f => f.startsWith(prefix) && f.endsWith('.docx'))
            .sort((a, b) => {
                return fs.statSync(path.join(dirPath, b)).mtime.getTime() -
                    fs.statSync(path.join(dirPath, a)).mtime.getTime();
            });

        if (peticionFiles.length === 0) {
            return res.status(404).json({ mensaje: "No se encontró petición para este expediente" });
        }

        const filePath = path.join(dirPath, peticionFiles[0]);
        res.download(filePath);
    } catch (error) {
        console.error("Error al descargar última petición:", error);
        res.status(500).json({ mensaje: "Error al descargar el archivo" });
    }
});

export default router;

