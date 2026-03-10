import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function Login() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  const navegar = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verPass, setVerPass] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    // Si ya tiene sesión, mandarlo al dashboard directamente o a su portal
    // Se comenta esta lógica para que el usuario pueda ver la pantalla de login al entrar a /
    /*
    const token = localStorage.getItem("token");
    const usuarioStr = localStorage.getItem("usuario");

    if (token && usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      if (usuario.rol === 'cliente') {
        if (usuario.username === 'cliente1') {
          navegar("/portal-cliente/1156");
        } else {
          navegar("/dashboard");
        }
      } else {
        navegar("/dashboard");
      }
    }
    */

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
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Respuesta no JSON:", text);
      throw new Error("El servidor no respondió con JSON válido");
      }

      if (!res.ok) {
        throw new Error(data.mensaje || "Error al iniciar sesión");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      if (data.usuario.rol === 'cliente') {
        // Redirección especial para el cliente de prueba
        if (data.usuario.username === 'cliente1') {
          navegar("/portal-cliente/1156");
        } else {
          // Si es otro cliente, por ahora lo mandamos a una página de "Mis Expedientes" (que crearíamos luego)
          navegar("/dashboard");
        }
      } else {
        navegar("/dashboard");
      }
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
      style={
        {
          "--mx": `${mouse.x}%`,
          "--my": `${mouse.y}%`,
        } as React.CSSProperties
      }
    >
      <div className="login-card">
        <div className="login-header">
          <h1>Inicio de sesión</h1>
          <p>Accedé a tu cuenta para continuar</p>
        </div>

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
            Usuario
            <input
              type="text"
              placeholder="Ingresá tu usuario"
              required
              className="login-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={cargando}
            />
          </label>

          <label className="login-label" style={{ position: 'relative' }}>
            Contraseña
            <div style={{ position: 'relative' }}>
              <input
                type={verPass ? "text" : "password"}
                placeholder="Ingresá tu contraseña"
                required
                className="login-input"
                style={{ paddingRight: '45px' }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={cargando}
              />
              <button
                type="button"
                onClick={() => setVerPass(!verPass)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(var(--principal-rgb), 0.1)',
                  border: '1px solid rgba(var(--principal-rgb), 0.2)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: 'var(--principal)',
                  padding: '4px 8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                {verPass ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </label>

          <button
            type="submit"
            className="login-button"
            disabled={cargando}
            style={{ position: 'relative' }}
          >
            {cargando ? "Iniciando sesión..." : "Ingresar"}
          </button>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navegar("/forgot-password");
              }}
              style={{
                fontSize: '0.85rem',
                color: 'var(--principal)',
                textDecoration: 'none',
                fontWeight: 500,
                opacity: 0.8,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
