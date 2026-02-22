import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Configuración centralizada del directorio de subidas
const UPLOAD_DIR = path.join(process.cwd(), "uploads");

// Asegurar que el directorio de subidas exista al iniciar
if (!fs.existsSync(UPLOAD_DIR)) {
    try {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        console.log(`Directorio de subidas creado: ${UPLOAD_DIR}`);
    } catch (error) {
        console.error(`Error al crear directorio de subidas ${UPLOAD_DIR}:`, error);
    }
}

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        // Nombre de archivo: timestamp-random-nombreoriginal_sanitizado
        const timestamp = Date.now();
        const random = Math.round(Math.random() * 1e9);
        const originalSanitizado = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");

        cb(null, `${timestamp}-${random}-${originalSanitizado}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Aceptar PDFs (MIME type application/pdf)
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Solo se permiten archivos PDF."));
        }
    },
    limits: {
        fileSize: 15 * 1024 * 1024 // 15MB límite
    }
});

// Ruta para subir archivos
router.post("/", upload.single("archivo"), (req: any, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ mensaje: "No se subió ningún archivo o formato incorrecto." });
        }

        // Devolvemos solo el nombre de archivo para guardar en la BD
        res.json({
            mensaje: "Archivo subido con éxito",
            archivo: req.file.filename,
            pathCompleto: req.file.path // Opcional, para debug
        });
    } catch (error) {
        console.error("Error en upload:", error);
        res.status(500).json({ mensaje: "Error al procesar el archivo en el servidor." });
    }
});

export default router;
