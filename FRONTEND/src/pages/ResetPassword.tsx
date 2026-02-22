import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "../config";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navegar = useNavigate();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [mouse, setMouse] = useState({ x: 50, y: 50 });

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

    useEffect(() => {
        if (!token) {
            setStatus({ type: 'error', message: 'Token de recuperación no válido o ausente.' });
        }

        const handleMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            setMouse({
                x: ((e.clientX - rect.left) / rect.width) * 100,
                y: ((e.clientY - rect.top) / rect.height) * 100,
            });
        };
        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setStatus({ type: 'error', message: 'Las contraseñas no coinciden.' });
        }

        if (password.length < 6) {
            return setStatus({ type: 'error', message: 'La contraseña debe tener al menos 6 caracteres.' });
        }

        setStatus({ type: 'loading', message: 'Actualizando contraseña...' });

        try {
            const res = await fetch(`${API_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.mensaje || "Error al restablecer la contraseña");
            }

            setStatus({ type: 'success', message: '¡Contraseña actualizada con éxito!' });

            // Redirigir al login después de 3 segundos
            setTimeout(() => navegar("/login"), 3000);
        } catch (err: any) {
            setStatus({ type: 'error', message: err.message });
        }
    };

    return (
        <div
            ref={containerRef}
            className="login-page"
            style={{ "--mx": `${mouse.x}%`, "--my": `${mouse.y}%` } as React.CSSProperties}
        >
            <div className="login-card">
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <img src="/imagenes_landing/logo_mensu.png" alt="Mensu Logo" style={{ width: "120px" }} />
                </div>

                <div className="login-header">
                    <h1>Nueva contraseña</h1>
                    <p>Ingresá y confirma tu nueva clave de acceso.</p>
                </div>

                {status.type === 'success' ? (
                    <div style={{ textAlign: "center", padding: "20px" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "15px" }}>✅</div>
                        <h3 style={{ color: "#2e7d32", marginBottom: "10px" }}>{status.message}</h3>
                        <p style={{ color: "#666", fontSize: "0.9rem" }}>Serás redirigido al inicio de sesión en instantes...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="login-form">
                        {status.type === 'error' && (
                            <div style={{
                                background: 'rgba(211, 47, 47, 0.1)',
                                color: '#d32f2f',
                                padding: '10px',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                marginBottom: '15px',
                                border: '1px solid rgba(211, 47, 47, 0.2)',
                                textAlign: 'center'
                            }}>
                                {status.message}
                            </div>
                        )}

                        <label className="login-label">
                            Nueva contraseña
                            <input
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                required
                                className="login-input"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                disabled={status.type === 'loading' || !token}
                            />
                        </label>

                        <label className="login-label">
                            Repetir nueva contraseña
                            <input
                                type="password"
                                placeholder="Confirmá tu clave"
                                required
                                className="login-input"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                disabled={status.type === 'loading' || !token}
                            />
                        </label>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={status.type === 'loading' || !token}
                        >
                            {status.type === 'loading' ? "Actualizando..." : "Cambiar contraseña"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
