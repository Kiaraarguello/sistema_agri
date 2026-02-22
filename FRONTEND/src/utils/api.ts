import { API_URL } from "../config";

export const apiFetch = async (url: string, options: any = {}) => {
    const token = localStorage.getItem("token");

    // Si la URL no es absoluta (no empieza con http), añadir API_URL
    const fullUrl = url.startsWith("http") ? url : `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;

    // Preparar cabeceras
    const headers = {
        ...options.headers,
        "Content-Type": "application/json",
    } as any;

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(fullUrl, {
        ...options,
        headers
    });

    if (response.status === 401) {
        // Si el token es inválido o expiró, limpiar y redirigir
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        window.location.href = "/login";
        throw new Error("Sesión expirada");
    }

    return response;
};
