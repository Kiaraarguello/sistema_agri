import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import dashboardRutas from "./rutas/dashboardRutas";
import expedienteRutas from "./rutas/expedienteRutas";
import clienteRutas from "./rutas/clienteRutas";
import uploadRutas from "./rutas/uploadRutas";
import honorarioRutas from "./rutas/honorarioRutas";
import calendarioRutas from "./rutas/calendarioRutas";
import authRutas from "./rutas/authRutas";
import usuarioRutas from "./rutas/usuarioRutas";
import terrenoRutas from "./rutas/terrenoRutas";
import alertaRutas from "./rutas/alertaRutas";
import finanzasRutas from "./rutas/finanzasRutas";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use("/pdf", express.static(path.join(process.cwd(), "..", "pdf")));

// Log de todas las peticiones (MOVIDO AL PRINCIPIO)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Rutas modulares
app.use("/api/dashboard", dashboardRutas);
app.use("/api/expedientes", expedienteRutas);
app.use("/api/clientes", clienteRutas);
app.use("/api/upload", uploadRutas);
app.use("/api/honorarios", honorarioRutas);
app.use("/api/calendario", calendarioRutas);
app.use("/api/auth", authRutas);
app.use("/api/usuarios", usuarioRutas);
app.use("/api/terrenos", terrenoRutas);
app.use("/api/alertas", alertaRutas);
app.use("/api/finanzas", finanzasRutas);

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
    console.warn(`[404] Ruta no encontrada: ${req.method} ${req.url}`);
    res.status(404).json({
        mensaje: `La ruta ${req.method} ${req.url} no existe en este servidor.`
    });
});

// Manejo de errores global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("!!! ERROR GLOBAL CATCHED:", err);
    res.status(err.status || 500).json({
        mensaje: "Error interno del servidor",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] Servidor corriendo en http://localhost:${PORT}`);
});
