import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../estilos/Dashboard.css";
import BarraLateralIzquierda from "../pages/BarraLateralIzquierda";

type Etapa =
  | "Catastro"
  | "Presupuesto"
  | "Relevamiento"
  | "Plano"
  | "Presentacion"
  | "Certificado"
  | "Visado"
  | "Mojones"
  | "Archivo";

type Expediente = {
  id: string;
  numero: string;
  cliente: string;
  terreno: string;
  etapa: Etapa;
  ultimaActualizacion: string;
};

type Alerta = {
  tipo: "Documentación" | "Avalúo" | "Sin actualizar";
  descripcion: string;
};

export default function Dashboard() {
  const contenedorRef = useRef<HTMLDivElement | null>(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  const [menuIzquierdaAbierto, setMenuIzquierdaAbierto] = useState(false);

  // Estados para datos del Backend
  const [datosDashboard, setDatosDashboard] = useState<{
    estadisticas: { total?: number; terminados?: number; enProceso?: number };
    expedientesRecientes: Expediente[];
  }>({
    estadisticas: {},
    expedientesRecientes: [],
  });

  const [cargando, setCargando] = useState(true);

  const alternarMenuIzquierda = () => setMenuIzquierdaAbierto((est) => !est);
  const cerrarMenuIzquierda = () => setMenuIzquierdaAbierto(false);

  // Cargar datos desde el Backend
  useEffect(() => {
    fetch("http://localhost:4000/api/dashboard/estadisticas")
      .then((res) => res.json())
      .then((data) => {
        setDatosDashboard(data);
        setCargando(false);
      })
      .catch((err) => console.error("Error cargando dashboard:", err));
  }, []);

  const alertas: Alerta[] = [
    { tipo: "Documentación", descripcion: "Datos importados del Excel correctamente." },
    { tipo: "Sin actualizar", descripcion: "Bienvenido al nuevo sistema de gestión." },
  ];

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!contenedorRef.current) return;
      const rect = contenedorRef.current.getBoundingClientRect();
      setMouse({
        x: Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
        y: Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)),
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <>
      <div
        ref={contenedorRef}
        className="dashboard-pagina"
        style={{ "--mx": `${mouse.x}%`, "--my": `${mouse.y}%` } as any}
      >
        <header className="dashboard-header">
          <div className="dashboard-header-izquierda">
            <button className="boton-menu-unificado" onClick={alternarMenuIzquierda}>☰</button>
            <h1>Estudio de Agrimensura</h1>
          </div>
          <div className="dashboard-acciones">
            <Link className="boton-principal" to="/expedientes/crear">+ Nuevo expediente</Link>
          </div>
        </header>

        <section className="dashboard-seccion">
          <h2>Resumen de Expedientes</h2>
          <div className="etapas-grid">
            <div className="etapa-card">
              <div className="etapa-titulo">Total</div>
              <div className="etapa-numero">{datosDashboard.estadisticas.total || 0}</div>
            </div>
            <div className="etapa-card">
              <div className="etapa-titulo">Terminados</div>
              <div className="etapa-numero">{datosDashboard.estadisticas.terminados || 0}</div>
            </div>
            <div className="etapa-card">
              <div className="etapa-titulo">En Proceso</div>
              <div className="etapa-numero">{datosDashboard.estadisticas.enProceso || 0}</div>
            </div>
          </div>
        </section>

        <section className="dashboard-seccion">
          <h2>Alertas e Información</h2>
          <div className="alertas-grid">
            {alertas.map((a, i) => (
              <div key={i} className="alerta-card">
                <div className="alerta-tipo">{a.tipo}</div>
                <div className="alerta-desc">{a.descripcion}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-seccion">
          <h2>Expedientes recientes</h2>
          <div className="tabla-contenedor">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Nº expediente</th>
                  <th>Cliente</th>
                  <th>Terreno / Dirección</th>
                  <th>Plan Visado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {datosDashboard.expedientesRecientes.map((exp) => (
                  <tr key={exp.id}>
                    <td>{exp.numero}</td>
                    <td>{exp.cliente}</td>
                    <td>{exp.terreno}</td>
                    <td>{exp.ultimaActualizacion}</td>
                    <td><Link className="boton-link" to={`/expedientes/detalle/${exp.id}`}>Ver</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {cargando && <p style={{ textAlign: 'center', padding: '20px' }}>Cargando datos reales...</p>}
          </div>
        </section>
      </div>
      <BarraLateralIzquierda abierto={menuIzquierdaAbierto} alCerrar={cerrarMenuIzquierda} />
    </>
  );
}
