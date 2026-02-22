import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secreto_super_seguro_123";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ mensaje: "No hay token de autenticación" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SECRET);
        (req as any).usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: "Sesión expirada o token inválido" });
    }
};
