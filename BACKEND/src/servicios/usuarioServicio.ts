import { query } from "../config/db";
import bcrypt from "bcryptjs";

export const crearUsuario = async (data: any) => {
    const { username, password, nombre, email, rol, expediente_id } = data;
    const hashedPw = await bcrypt.hash(password, 10);

    const res = await query(`
        INSERT INTO usuarios (username, password, nombre, email, rol, activo, expediente_id)
        VALUES (?, ?, ?, ?, ?, 1, ?)
    `, [username, hashedPw, nombre, email, rol, expediente_id || null]);

    // En MySQL, el resultado de la inserción está en res.rows
    const resultHeader = res.rows as any;
    return { id: resultHeader.insertId, username, nombre, email, rol, activo: 1 };
};

export const listarUsuarios = async () => {
    const res = await query(`
        SELECT u.*, 
          (SELECT e.id 
           FROM expediente e 
           JOIN clientes c ON e.cliente_id = c.id 
           WHERE LOWER(TRIM(c.nombre_completo)) = LOWER(TRIM(u.nombre))
              OR LOWER(TRIM(u.nombre)) LIKE CONCAT('%', LOWER(TRIM(c.nombre_completo)), '%')
              OR LOWER(TRIM(c.nombre_completo)) LIKE CONCAT('%', LOWER(TRIM(u.nombre)), '%')
           ORDER BY e.id DESC 
           LIMIT 1) as search_expediente_id
        FROM usuarios u 
        ORDER BY created_at DESC
    `);

    return res.rows.map((u: any) => ({
        ...u,
        expediente_id: u.expediente_id || u.search_expediente_id
    }));
};

export const actualizarUsuario = async (id: number, data: any) => {
    const { nombre, email, rol, activo, expediente_id } = data;
    await query(`
        UPDATE usuarios 
        SET nombre = ?, email = ?, rol = ?, activo = ?, expediente_id = ? 
        WHERE id = ?
    `, [nombre, email, rol, activo, expediente_id || null, id]);
    return { id, ...data };
};

export const darDeBajaUsuario = async (id: number) => {
    await query("UPDATE usuarios SET activo = 0 WHERE id = ?", [id]);
    return { id, activo: 0 };
};

export const darDeAltaUsuario = async (id: number) => {
    await query("UPDATE usuarios SET activo = 1 WHERE id = ?", [id]);
    return { id, activo: 1 };
};

export const eliminarUsuario = async (id: number) => {
    await query("DELETE FROM usuarios WHERE id = ?", [id]);
    return { id, eliminado: true };
};

export const listarClientesDisponibles = async () => {
    const result = await query(`
        SELECT c.id, c.nombre_completo, e.id as expediente_id 
        FROM clientes c
        LEFT JOIN expediente e ON e.cliente_id = c.id
        ORDER BY c.nombre_completo ASC
    `);
    return result.rows;
};
