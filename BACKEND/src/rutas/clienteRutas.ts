import { Router } from "express";
import { query } from "../config/db";

const router = Router();

// Obtener todos los clientes
router.get("/", async (req, res) => {
    try {
        const result = await query('SELECT * FROM clientes ORDER BY nombre_completo ASC');
        const data = result.rows.map((c: any) => ({
            id: c.id.toString(),
            nombreCompleto: c.nombre_completo,
            dniCuil: c.dni_cuil || "",
            telefono: c.telefono || "",
            email: c.email || "",
            direccion: c.direccion || "",
            localidad: c.localidad || "",
            provincia: c.provincia || "",
            notas: c.notas || "",
            fechaAlta: c.fecha_alta ? new Date(c.fecha_alta).toISOString().split('T')[0] : ""
        }));
        res.json(data);
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        res.status(500).json({ mensaje: "Error al obtener clientes" });
    }
});

// Obtener un cliente por ID (con sus expedientes)
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('SELECT * FROM clientes WHERE id = ?', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: "Cliente no encontrado" });
        }

        const c = result.rows[0];

        // Buscar expedientes asociados
        const expResult = await query(`
            SELECT e.id, e.id as numero, t.direccion as terreno, e.terminado, e.visado_dgc 
            FROM expediente e 
            LEFT JOIN terreno t ON e.terreno_id = t.id
            WHERE e.cliente_id = ? 
            ORDER BY e.id DESC
        `, [id]);

        const expedientes = expResult.rows.map((exp: any) => ({
            id: exp.id.toString(),
            numero: exp.id.toString(),
            terreno: exp.terreno || "Sin dirección",
            estado: exp.terminado ? "Finalizado" : "En Proceso",
            ultimaActualizacion: exp.visado_dgc ? new Date(exp.visado_dgc).toISOString().split('T')[0] : "Pendiente"
        }));

        const data = {
            id: c.id.toString(),
            nombreCompleto: c.nombre_completo,
            dniCuil: c.dni_cuil || "",
            telefono: c.telefono || "",
            email: c.email || "",
            direccion: c.direccion || "",
            localidad: c.localidad || "",
            provincia: c.provincia || "",
            notas: c.notas || "",
            fechaAlta: c.fecha_alta ? new Date(c.fecha_alta).toISOString().split('T')[0] : "",
            expedientes
        };

        res.json(data);
    } catch (error) {
        console.error("Error al obtener cliente:", error);
        res.status(500).json({ mensaje: "Error al obtener cliente" });
    }
});

// Crear cliente
router.post("/", async (req, res) => {
    try {
        const { nombreCompleto, dniCuil, telefono, email, direccion, localidad, provincia, notas } = req.body;
        const result = await query(
            'INSERT INTO clientes (nombre_completo, dni_cuil, telefono, email, direccion, localidad, provincia, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [nombreCompleto, dniCuil, telefono, email, direccion, localidad, provincia, notas]
        );
        res.status(201).json({ mensaje: "Cliente creado", id: (result.rows as any).insertId });
    } catch (error) {
        console.error("Error al crear cliente:", error);
        res.status(500).json({ mensaje: "Error al crear cliente" });
    }
});

// Actualizar cliente
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreCompleto, dniCuil, telefono, email, direccion, localidad, provincia, notas } = req.body;
        await query(
            'UPDATE clientes SET nombre_completo = ?, dni_cuil = ?, telefono = ?, email = ?, direccion = ?, localidad = ?, provincia = ?, notas = ? WHERE id = ?',
            [nombreCompleto, dniCuil, telefono, email, direccion, localidad, provincia, notas, id]
        );
        res.json({ mensaje: "Cliente actualizado" });
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        res.status(500).json({ mensaje: "Error al actualizar cliente" });
    }
});

// Eliminar cliente
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Limpiar referencias en expedientes para no perderlos
        await query('UPDATE expediente SET cliente_id = NULL WHERE cliente_id = ?', [id]);

        // 2. Eliminar el cliente
        await query('DELETE FROM clientes WHERE id = ?', [id]);

        res.json({ mensaje: "Cliente eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar cliente:", error);
        res.status(500).json({ mensaje: "Error al eliminar cliente" });
    }
});

export default router;
