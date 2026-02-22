import { query } from "../config/db";

export const obtenerNotasMes = async (mes: number, anio: number) => {
    // Buscamos notas que pertenezcan al mes y año indicados
    // Usamos el formato de MySQL para filtrar por mes y año
    const res = await query(`
        SELECT id, DATE_FORMAT(fecha, '%Y-%m-%d') as fecha, contenido 
        FROM calendario_notas 
        WHERE MONTH(fecha) = ? AND YEAR(fecha) = ?
    `, [mes, anio]);
    return res.rows;
};

export const guardarNota = async (fecha: string, contenido: string) => {
    // Si ya existe una nota para ese día, la actualizamos. Si no, la creamos.
    const existente = await query("SELECT id FROM calendario_notas WHERE fecha = ?", [fecha]);

    if (existente.rows.length > 0) {
        if (contenido.trim() === "") {
            // Si el contenido está vacío, borramos la nota
            return await query("DELETE FROM calendario_notas WHERE fecha = ?", [fecha]);
        }
        return await query("UPDATE calendario_notas SET contenido = ? WHERE fecha = ?", [contenido, fecha]);
    } else {
        if (contenido.trim() === "") return; // No creamos notas vacías
        return await query("INSERT INTO calendario_notas (fecha, contenido) VALUES (?, ?)", [fecha, contenido]);
    }
};

export const obtenerNotasRango = async (inicio: string, fin: string) => {
    const res = await query(`
        SELECT id, DATE_FORMAT(fecha, '%Y-%m-%d') as fecha, contenido 
        FROM calendario_notas 
        WHERE fecha BETWEEN ? AND ?
        ORDER BY fecha ASC
    `, [inicio, fin]);
    return res.rows;
};
