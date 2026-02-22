import { Request, Response } from "express";
import * as dashboardServicio from "../servicios/dashboardServicio";

export const obtenerDatosDashboard = async (req: Request, res: Response) => {
    try {
        const datos = await dashboardServicio.obtenerEstadisticasDashboard();
        res.json(datos);
    } catch (error) {
        console.error("Error en controlador dashboard:", error);
        res.status(500).json({ mensaje: "Error al obtener datos del dashboard" });
    }
};

export const buscar = async (req: Request, res: Response) => {
    const { termino, q } = req.query;
    const busqueda = (termino || q || "") as string;
    try {
        const resultados = await dashboardServicio.buscarExpedientes(busqueda);
        res.json(resultados);
    } catch (error) {
        res.status(500).json({ mensaje: "Error en la búsqueda" });
    }
}; export const obtenerExpedientesEtapa = async (req: Request, res: Response) => {
    const etapa = String(req.params.etapa);
    try {
        const resultados = await dashboardServicio.obtenerExpedientesPorEtapa(etapa);
        res.json(resultados);
    } catch (error) {
        console.error("Error obteniendo expedientes por etapa:", error);
        res.status(500).json({ mensaje: "Error al obtener lista" });
    }
};

export const cambiarEstadoCliente = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { activo } = req.body;
    try {
        await dashboardServicio.toggleEstadoCliente(Number(id), activo);
        res.json({ mensaje: "Estado del cliente actualizado" });
    } catch (error) {
        console.error("Error cambiando estado cliente:", error);
        res.status(500).json({ mensaje: "Error al cambiar estado" });
    }
};
