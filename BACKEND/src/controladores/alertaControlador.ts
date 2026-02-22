
import { Request, Response } from "express";
import * as alertaServicio from "../servicios/alertaServicio";

export const crearAlerta = async (req: Request, res: Response) => {
    try {
        await alertaServicio.crearAlerta(req.body);
        res.json({ mensaje: "Alerta creada correctamente" });
    } catch (error) {
        console.error("Error en crearAlerta:", error);
        res.status(500).json({ mensaje: "Error al crear la alerta" });
    }
};

export const listarAlertasInicio = async (req: Request, res: Response) => {
    try {
        const alertas = await alertaServicio.obtenerAlertasDashboard();
        res.json(alertas);
    } catch (error) {
        console.error("Error en listarAlertasInicio:", error);
        res.status(500).json({ mensaje: "Error al obtener alertas" });
    }
};

export const marcarVista = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await alertaServicio.marcarComoVisto(Number(id));
        res.json({ mensaje: "Alerta marcada como vista" });
    } catch (error) {
        console.error("Error en marcarVista:", error);
        res.status(500).json({ mensaje: "Error al actualizar alerta" });
    }
};
export const actualizarAlerta = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await alertaServicio.actualizarAlerta(Number(id), req.body);
        res.json({ mensaje: "Alerta actualizada correctamente" });
    } catch (error) {
        console.error("Error en actualizarAlerta:", error);
        res.status(500).json({ mensaje: "Error al actualizar la alerta" });
    }
};

export const eliminarAlerta = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await alertaServicio.eliminarAlerta(Number(id));
        res.json({ mensaje: "Alerta eliminada correctamente" });
    } catch (error) {
        console.error("Error en eliminarAlerta:", error);
        res.status(500).json({ mensaje: "Error al eliminar la alerta" });
    }
};
