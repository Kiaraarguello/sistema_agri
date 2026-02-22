import { NavLink } from "react-router-dom";
import "../estilos/BarraLateral.css";
type Props = {
  abierto: boolean;
  alCerrar: () => void;
};

export default function BarraLateralIzquierda({ abierto, alCerrar }: Props) {
  return (
    <>
      <div
        className={`overlay-lateral ${abierto ? "activo" : ""}`}
        onClick={alCerrar}
        aria-hidden={!abierto}
      />

      <aside className={`barra-lateral-izquierda ${abierto ? "abierta" : ""}`}>
        <div className="barra-lateral-header">
          <button
            className="boton-cerrar-lateral"
            onClick={alCerrar}
            type="button"
            aria-label="Cerrar menú"
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        <nav className="barra-lateral-links">
          <NavLink to="/dashboard" className="link-lateral" onClick={alCerrar}>
            Principal
          </NavLink>

          <NavLink to="/clientes" className="link-lateral" onClick={alCerrar}>
            Clientes
          </NavLink>

          <NavLink to="/terrenos" className="link-lateral" onClick={alCerrar}>
            Terrenos
          </NavLink>

          <NavLink to="/expedientes" className="link-lateral" onClick={alCerrar}>
            Expedientes
          </NavLink>

          <NavLink to="/honorarios" className="link-lateral" onClick={alCerrar}>
            Honorarios
          </NavLink>

          <NavLink to="/finanzas" className="link-lateral" onClick={alCerrar}>
            Finanzas
          </NavLink>

          <NavLink to="/calendario" className="link-lateral" onClick={alCerrar}>
            Calendario
          </NavLink>

          <NavLink to="/usuarios" className="link-lateral" onClick={alCerrar}>
            Usuarios
          </NavLink>
        </nav>

        <div className="barra-lateral-footer">
          <div className="usuario-info">
            <span className="usuario-label">Usuario:</span>
            <span className="usuario-nombre">
              {JSON.parse(localStorage.getItem("usuario") || "{}").nombre || "Invitado"}
            </span>
          </div>
          <button
            className="boton-cerrar-sesion"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("usuario");
              window.location.href = "/login";
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
