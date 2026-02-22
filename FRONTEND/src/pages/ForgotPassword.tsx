import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [mouse, setMouse] = useState({ x: 50, y: 50 });
    const navegar = useNavigate();

    const [email, setEmail] = useState("");
    const [enviado, setEnviado] = useState(false);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setMouse({
                x: Math.max(0, Math.min(100, x)),
                y: Math.max(0, Math.min(100, y)),
            });
        };
        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setCargando(true);

        try {
            const res = await fetch("http://localhost:4000/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.mensaje || "Error al procesar la solicitud");
            }

            setEnviado(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setCargando(false);
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
                    <img src="/imagenes_landing/logo_mensu.png" alt="Mensu Logo" style={{ width: "120px", marginBottom: "10px" }} />
                </div>

                <div className="login-header">
                    <h1>Recuperar contraseña</h1>
                    <p>Ingresá tu correo electrónico para recibir un enlace de recuperación.</p>
                </div>

                {enviado ? (
                    <div style={{ textAlign: "center", padding: "20px" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "15px" }}>✉️</div>
                        <h3 style={{ color: "var(--principal)", marginBottom: "10px" }}>¡Correo enviado!</h3>
                        <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "20px" }}>
                            Si el correo existe en nuestro sistema, recibirás las instrucciones en breve.
                        </p>
                        <button className="login-button" onClick={() => navegar("/login")}>
                            Volver al inicio de sesión
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="login-form">
                        {error && (
                            <div style={{
                                background: 'rgba(211, 47, 47, 0.1)',
                                color: '#d32f2f',
                                padding: '10px',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                marginBottom: '15px',
                                border: '1px solid rgba(211, 47, 47, 0.2)',
                                textAlign: 'center',
                                fontWeight: 600
                            }}>
                                {error}
                            </div>
                        )}

                        <label className="login-label">
                            Correo Electrónico
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                required
                                className="login-input"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                disabled={cargando}
                            />
                        </label>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={cargando}
                        >
                            {cargando ? "Enviando..." : "Enviar enlace de recuperación"}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navegar("/login");
                                }}
                                style={{
                                    fontSize: '0.85rem',
                                    color: '#666',
                                    textDecoration: 'none',
                                    fontWeight: 500
                                }}
                            >
                                Volver al login
                            </a>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
