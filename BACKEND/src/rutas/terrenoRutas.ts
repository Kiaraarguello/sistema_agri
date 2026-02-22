import { Router } from "express";
import { query } from "../config/db";

const router = Router();

// Obtener todos los terrenos (basado primordialmente en la tabla expediente)
router.get("/", async (req, res) => {
    try {
        const result = await query(`
            SELECT 
                t.*,
                e.id as expediente_id, 
                e.partida_inmobiliaria,
                e.titular,
                e.objeto,
                e.fecha_apertura,
                e.notas,
                e.pdf_catastro_file,
                c.nombre_completo as cliente_nombre
            FROM terreno t
            LEFT JOIN expediente e ON e.terreno_id = t.id
            LEFT JOIN clientes c ON e.cliente_id = c.id
            WHERE (t.direccion IS NOT NULL AND CHAR_LENGTH(t.direccion) > 0)
               OR (t.seccion != 0 OR t.chacra != 0 OR t.manzana != 0 OR t.parcela IS NOT NULL OR t.lote IS NOT NULL)
            ORDER BY t.id DESC
        `);

        // Formatear la nomenclatura como: Seccion-Chacra-Manzana-Parcela-Lote
        const data = result.rows.map((row: any) => ({
            id: row.id.toString(),
            nomenclatura: `${row.seccion || "00"}-${row.chacra || "00"}-${row.manzana || "00"}-${row.parcela || "00"}`,
            partida: row.partida_inmobiliaria || "—",
            lote: row.lote || "—",
            manzana: row.manzana || "—",
            superficie: row.superficie || "—",
            ubicacion: row.direccion || row.objeto || "Sin dirección",
            localidad: row.municipio || "Sin localidad",
            provincia: "Misiones",
            clienteId: row.cliente_nombre || row.titular || "S/D",
            notas: row.notas || "",
            fechaAlta: row.fecha_apertura ? new Date(row.fecha_apertura).toISOString().split('T')[0] : "—",
            pdfCatastro: row.pdf_catastro_file
        }));

        res.json(data);
    } catch (error) {
        console.error("Error al obtener terrenos:", error);
        res.status(500).json({ mensaje: "Error al obtener terrenos" });
    }
});

// Obtener detalle de un terreno
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query(`
            SELECT 
                t.*,
                e.id as expediente_id,
                e.partida_inmobiliaria,
                e.titular,
                e.objeto,
                e.fecha_apertura,
                e.notas,
                e.pdf_catastro_file as exp_pdf_catastro,
                e.terminado,
                c.nombre_completo as cliente_nombre
            FROM terreno t
            LEFT JOIN expediente e ON e.terreno_id = t.id
            LEFT JOIN clientes c ON e.cliente_id = c.id
            WHERE t.id = ?
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: "Terreno no encontrado" });
        }

        const row = result.rows[0];

        const data = {
            id: row.id.toString(),
            nomenclatura: `${row.seccion || "00"}-${row.chacra || "00"}-${row.manzana || "00"}-${row.parcela || "00"}`,
            partida: row.partida_inmobiliaria || "—",
            lote: row.lote || "—",
            manzana: row.manzana || "—",
            superficie: row.superficie || "—",
            ubicacion: row.direccion || row.objeto || "Sin dirección",
            localidad: row.municipio || "Sin localidad",
            provincia: "Misiones",
            clienteId: row.cliente_nombre || row.titular || "S/D",
            notas: row.notas || "",
            fechaAlta: row.fecha_apertura ? new Date(row.fecha_apertura).toISOString().split('T')[0] : "—",
            pdfCatastro: row.pdf_catastro || row.exp_pdf_catastro,
            // Datos adicionales de expediente/terreno
            municipio: row.municipio,
            depto: row.depto,
            titular: row.titular,
            objeto: row.objeto,
            // Coordenadas
            latitud: row.latitud,
            longitud: row.longitud,
            expedientes: row.expediente_id ? [
                {
                    id: row.expediente_id.toString(),
                    caratula: row.objeto || "Expediente de Agrimensura",
                    estado: row.terminado ? "Finalizado" : "En Trámite",
                    fechaInicio: row.fecha_apertura ? new Date(row.fecha_apertura).toISOString().split('T')[0] : "—"
                }
            ] : []
        };

        res.json(data);
    } catch (error) {
        console.error("Error al obtener detalle del terreno:", error);
        res.status(500).json({ mensaje: "Error al obtener detalle del terreno" });
    }
});

export default router;
