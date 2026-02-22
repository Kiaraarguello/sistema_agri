import { Router } from "express";
import * as dashboardCtrl from "../controladores/dashboardControlador";

import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/estadisticas", dashboardCtrl.obtenerDatosDashboard);
router.get("/buscar", dashboardCtrl.buscar);
router.get("/expedientes/:etapa", dashboardCtrl.obtenerExpedientesEtapa);
router.put("/clientes/:id/estado", dashboardCtrl.cambiarEstadoCliente);

export default router;
