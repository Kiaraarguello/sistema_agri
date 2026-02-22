import { Router } from "express";
import * as usuarioCtrl from "../controladores/usuarioControlador";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/", usuarioCtrl.listar);
router.post("/", usuarioCtrl.crear);
router.put("/:id", usuarioCtrl.actualizar);
router.patch("/:id/estado", usuarioCtrl.cambiarEstado);
router.delete("/:id", usuarioCtrl.eliminar);

export default router;
