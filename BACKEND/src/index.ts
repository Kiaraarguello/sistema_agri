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
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/pdf", express.static(path.join(process.cwd(), "..", "pdf")));

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

// Ruta de estado
app.get("/", (req, res) => {
    res.send("Servidor de Agrimensura (API) funcionando perfectamente 🚀");
});

app.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] Servidor corriendo en http://localhost:${PORT}`);
});
