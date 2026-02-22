import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function RegisterInvitation() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navegar = useNavigate();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [mouse, setMouse] = useState({ x: 50, y: 50 });

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [verPass, setVerPass] = useState(false);
    const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

    useEffect(() => {
        if (!token) {
            setStatus({ type: 'error', message: 'Token de invitación no válido o ausente.' });
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

        setStatus({ type: 'loading', message: 'Creando cuenta...' });

        try {
            const res = await fetch("http://localhost:4000/api/auth/register-invitation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, username, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.mensaje || "Error al crear la cuenta");
            }

            // Guardar sesión y redirigir
            localStorage.setItem("token", data.token);
            localStorage.setItem("usuario", JSON.stringify(data.usuario));

            setStatus({ type: 'success', message: '¡Cuenta creada con éxito!' });

            setTimeout(() => {
                const usuario = data.usuario;
                if (usuario.rol === 'cliente') {
                    // Si el servidor devolvió el expediente ID en el token, el servicio ya lo vinculó.
                    // Necesitamos saber qué expediente mostrar.
                    // Como es un cliente nuevo, su usuario tiene el expediente_id.
                    navegar(`/portal-cliente/${usuario.expediente_id || ''}`);
                } else {
                    navegar("/dashboard");
                }
            }, 2000);
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
                    <h1 style={{ color: "var(--principal)", fontSize: "1.5rem", marginBottom: "5px" }}>Estudio Daviña</h1>
                    <img src="/imagenes_landing/logo_mensu.png" alt="Mensu Logo" style={{ width: "80px" }} />
                </div>

                <div className="login-header">
                    <h1>Crea tu cuenta</h1>
                    <p>Completá los datos para acceder al seguimiento de tu expediente.</p>
                </div>

                {status.type === 'success' ? (
                    <div style={{ textAlign: "center", padding: "20px" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "15px" }}>✅</div>
                        <h3 style={{ color: "#2e7d32", marginBottom: "10px" }}>{status.message}</h3>
                        <p style={{ color: "#666", fontSize: "0.9rem" }}>Iniciando sesión automáticamente...</p>
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
                            Elegí un nombre de Usuario
                            <input
                                type="text"
                                placeholder="Ej: kmar_88"
                                required
                                className="login-input"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                disabled={status.type === 'loading' || !token}
                            />
                        </label>

                        <label className="login-label">
                            Contraseña
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={verPass ? "text" : "password"}
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                    className="login-input"
                                    style={{ paddingRight: '45px' }}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    disabled={status.type === 'loading' || !token}
                                />
                                <button
                                    type="button"
                                    onClick={() => setVerPass(!verPass)}
                                    style={{
                                        position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.7rem', color: 'var(--principal)', fontWeight: 'bold'
                                    }}
                                >
                                    {verPass ? "OCULTAR" : "VER"}
                                </button>
                            </div>
                        </label>

                        <label className="login-label">
                            Confirmar Contraseña
                            <input
                                type="password"
                                placeholder="Repetí tu clave"
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
                            {status.type === 'loading' ? "Procesando..." : "Crear mi cuenta y acceder"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
