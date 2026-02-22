import { Router } from "express";
import * as calendarioCtrl from "../controladores/calendarioControlador";

import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/", calendarioCtrl.listarNotas);
router.get("/rango", calendarioCtrl.listarNotasRango);
router.post("/", calendarioCtrl.upsertNota);

export default router;
