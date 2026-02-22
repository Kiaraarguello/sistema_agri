import { Request, Response } from "express";
import * as calendarioServicio from "../servicios/calendarioServicio";

export const listarNotas = async (req: Request, res: Response) => {
    const { mes, anio } = req.query;
    try {
        const notas = await calendarioServicio.obtenerNotasMes(Number(mes), Number(anio));
        res.json(notas);
    } catch (error) {
        console.error("Error en listarNotas:", error);
        res.status(500).json({ mensaje: "Error al obtener notas" });
    }
};

export const upsertNota = async (req: Request, res: Response) => {
    const { fecha, contenido } = req.body;
    try {
        await calendarioServicio.guardarNota(fecha, contenido);
        res.json({ mensaje: "Nota guardada correctamente" });
    } catch (error) {
        console.error("Error en upsertNota:", error);
        res.status(500).json({ mensaje: "Error al guardar nota" });
    }
};

export const listarNotasRango = async (req: Request, res: Response) => {
    const { inicio, fin } = req.query;
    try {
        const notas = await calendarioServicio.obtenerNotasRango(String(inicio), String(fin));
        res.json(notas);
    } catch (error) {
        console.error("Error en listarNotasRango:", error);
        res.status(500).json({ mensaje: "Error al obtener notas por rango" });
    }
};
