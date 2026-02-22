import { Request, Response } from "express";
import * as usuarioServicio from "../servicios/usuarioServicio";

export const listar = async (req: Request, res: Response) => {
    try {
        const usuarios = await usuarioServicio.listarUsuarios();
        res.json(usuarios);
    } catch (error) {
        console.error("Error en listar usuarios:", error);
        res.status(500).json({ mensaje: "Error al obtener usuarios" });
    }
};

export const crear = async (req: Request, res: Response) => {
    try {
        const usuario = await usuarioServicio.crearUsuario(req.body);
        res.status(201).json(usuario);
    } catch (error: any) {
        console.error("Error en crear usuario:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ mensaje: "El nombre de usuario ya existe" });
        }
        res.status(500).json({ mensaje: "Error al crear usuario" });
    }
};

export const actualizar = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const usuario = await usuarioServicio.actualizarUsuario(Number(id), req.body);
        res.json(usuario);
    } catch (error) {
        console.error("Error en actualizar usuario:", error);
        res.status(500).json({ mensaje: "Error al actualizar usuario" });
    }
};

export const cambiarEstado = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { activo } = req.body;
    try {
        let resultado;
        if (activo) {
            resultado = await usuarioServicio.darDeAltaUsuario(Number(id));
        } else {
            resultado = await usuarioServicio.darDeBajaUsuario(Number(id));
        }
        res.json(resultado);
    } catch (error) {
        console.error("Error en cambiar estado usuario:", error);
        res.status(500).json({ mensaje: "Error al cambiar estado" });
    }
};

export const eliminar = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await usuarioServicio.eliminarUsuario(Number(id));
        res.json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error("Error en eliminar usuario:", error);
        res.status(500).json({ mensaje: "Error al eliminar usuario" });
    }
};

export const listarClientes = async (req: Request, res: Response) => {
    try {
        const clientes = await usuarioServicio.listarClientesDisponibles();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener clientes" });
    }
};
