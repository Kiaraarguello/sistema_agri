
import { query } from "../config/db";

export const crearAlerta = async (datos: {
    titulo: string;
    fecha: string;
    hora?: string | null;
    expediente_id?: number | null;
    notas?: string;
}) => {
    return await query(
        `INSERT INTO alertas (titulo, fecha, hora, expediente_id, notas) VALUES (?, ?, ?, ?, ?)`,
        [datos.titulo, datos.fecha, datos.hora || null, datos.expediente_id || null, datos.notas || ""]
    );
};

export const obtenerAlertasDashboard = async () => {
    // Obtenemos alertas que no han sido vistas 
    const res = await query(`
        SELECT a.*, DATE_FORMAT(a.hora, '%H:%i') as hora_limpia, e.objeto as expediente_objeto
        FROM alertas a
        LEFT JOIN expediente e ON a.expediente_id = e.id
        WHERE a.visto = 0
        ORDER BY a.fecha ASC, a.hora ASC
    `);
    return res.rows;
};

export const marcarComoVisto = async (id: number) => {
    return await query(`UPDATE alertas SET visto = 1 WHERE id = ?`, [id]);
};

export const obtenerAlertasCalendario = async (mes: number, anio: number) => {
    const res = await query(`
        SELECT id, titulo, DATE_FORMAT(fecha, '%Y-%m-%d') as fecha, DATE_FORMAT(hora, '%H:%i') as hora, expediente_id, notas
        FROM alertas
        WHERE MONTH(fecha) = ? AND YEAR(fecha) = ?
        ORDER BY hora ASC
    `, [mes, anio]);
    return res.rows;
};
export const actualizarAlerta = async (id: number, datos: {
    titulo: string;
    fecha: string;
    hora?: string | null;
    expediente_id?: number | null;
    notas?: string;
}) => {
    return await query(
        `UPDATE alertas SET titulo = ?, fecha = ?, hora = ?, expediente_id = ?, notas = ? WHERE id = ?`,
        [datos.titulo, datos.fecha, datos.hora || null, datos.expediente_id || null, datos.notas || "", id]
    );
};

export const eliminarAlerta = async (id: number) => {
    return await query(`DELETE FROM alertas WHERE id = ?`, [id]);
};
