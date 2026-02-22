import { Router } from "express";
import { obtenerEstadisticasFinancieras } from "../servicios/finanzasServicio";

const router = Router();

router.get("/estadisticas", async (req, res) => {
    try {
        const { periodo } = req.query;
        const stats = await obtenerEstadisticasFinancieras(periodo as string);
        res.json(stats);
    } catch (error) {
        console.error("Error al obtener estadísticas financieras:", error);
        res.status(500).json({ mensaje: "Error al obtener estadísticas financieras" });
    }
});

export default router;
