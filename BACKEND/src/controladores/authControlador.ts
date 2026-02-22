import { Request, Response } from "express";
import * as authServicio from "../servicios/authServicio";

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ mensaje: "Usuario y contraseña requeridos" });
    }

    try {
        const resultado = await authServicio.login(username, password);
        res.json(resultado);
    } catch (error: any) {
        console.warn(`Intento de login fallido para ${username}: ${error.message}`);
        res.status(401).json({ mensaje: error.message });
    }
};

export const verificarToken = (req: Request, res: Response) => {
    // Simplemente devuelve OK si el middleware de auth pasó
    res.json({ mensaje: "Token válido", usuario: (req as any).usuario });
};

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ mensaje: "El email es requerido" });

    try {
        await authServicio.forgotPassword(email);
        res.json({ mensaje: "Enlace de recuperación enviado" });
    } catch (error: any) {
        // Por seguridad, a veces no queremos informar si el email existe o no
        // Pero por ahora lo dejamos así
        res.status(500).json({ mensaje: error.message });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ mensaje: "Token y contraseña requeridos" });

    try {
        await authServicio.resetPassword(token, password);
        res.json({ mensaje: "Contraseña actualizada exitosamente" });
    } catch (error: any) {
        res.status(401).json({ mensaje: error.message });
    }
};

export const registerFromInvitation = async (req: Request, res: Response) => {
    const { token, username, password } = req.body;
    if (!token || !username || !password) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    try {
        const resultado = await authServicio.registerFromInvitation(token, username, password);
        res.json(resultado);
    } catch (error: any) {
        res.status(500).json({ mensaje: error.message });
    }
};
