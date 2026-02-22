
import { Router } from "express";
import * as alertaCtrl from "../controladores/alertaControlador";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/", alertaCtrl.crearAlerta);
router.get("/inicio", alertaCtrl.listarAlertasInicio);
router.put("/:id", alertaCtrl.actualizarAlerta);
router.delete("/:id", alertaCtrl.eliminarAlerta);
router.put("/:id/visto", alertaCtrl.marcarVista);

export default router;
