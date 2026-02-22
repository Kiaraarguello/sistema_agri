export const apiFetch = async (url: string, options: any = {}) => {
    const token = localStorage.getItem("token");

    // Preparar cabeceras
    const headers = {
        ...options.headers,
        "Content-Type": "application/json",
    } as any;

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
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
