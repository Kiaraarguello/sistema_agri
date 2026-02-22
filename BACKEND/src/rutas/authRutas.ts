import { Router } from "express";
import * as authCtrl from "../controladores/authControlador";
import rateLimit from "express-rate-limit";

const router = Router();

// Limitador de tasa: Máximo 10 intentos de login cada 15 minutos por IP
// Esto es seguridad extra a nivel de red
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { mensaje: "Demasiados intentos desde esta red. Por favor intente más tarde." }
});

router.post("/login", loginLimiter, authCtrl.login);
router.post("/forgot-password", authCtrl.forgotPassword);
router.post("/reset-password", authCtrl.resetPassword);
router.post("/register-invitation", authCtrl.registerFromInvitation);

export default router;
