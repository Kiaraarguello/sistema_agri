// Configuración Global de la API
// Si el entorno es desarrollo (localhost), usa el puerto 4000.
// Si el entorno es producción, usa la URL del servidor actual.
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const API_BASE_URL = isLocal
    ? "http://localhost:4000"
    : window.location.origin; // O puedes poner la URL fija del backend aquí: e.g. "https://api.tu-servidor.com"

export const API_URL = `${API_BASE_URL}/api`;
