import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../estilos/dashboard.css";
import BarraLateralIzquierda from "../pages/BarraLateralIzquierda";
import { apiFetch } from "../utils/api";

type Etapa =
  | "Catastro"
  | "Presupuesto"
  | "Relevamiento"
  | "Plano"
  | "Previa DGC"
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
  etapasStatus?: Record<string, boolean>;
};

type Alerta = {
  id?: number;
  tipo: "Urgente" | "Demora" | "Informacion" | "Tramite" | "Recordatorio";
  descripcion: string;
  expedienteId?: string;
  fecha?: string;
  notas?: string;
  esPersonalizada?: boolean;
};

type NotaCalendario = {
  id: number;
  fecha: string;
  contenido: string;
};

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuarioStr = localStorage.getItem("usuario");

    if (!token) {
      navigate("/login");
      return;
    }

    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      if (usuario.rol === 'cliente') {
        if (usuario.username === 'cliente1') {
          navigate("/portal-cliente/1156");
        } else {
          // Si por alguna razón un cliente entra al dashboard, lo sacamos o mandamos a login
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          navigate("/login");
        }
      }
    }
  }, [navigate]);

  const contenedorRef = useRef<HTMLDivElement | null>(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  const [menuIzquierdaAbierto, setMenuIzquierdaAbierto] = useState(false);

  // Estados para datos del Backend
  const [datosDashboard, setDatosDashboard] = useState<{
    estadisticas: { [key: string]: number };
    expedientesRecientes: Expediente[];
    alertas: Alerta[];
  }>({
    estadisticas: {
      Total: 0,
      Catastro: 0,
      Presupuesto: 0,
      Relevamiento: 0,
      Plano: 0,
      Presentacion: 0,
      Certificado: 0,
      Visado: 0,
      Mojones: 0,
      Archivo: 0,
    },
    expedientesRecientes: [],
    alertas: [],
  });

  const [cargando, setCargando] = useState(true);
  const [modalEtapa, setModalEtapa] = useState<Etapa | "Total" | null>(null);
  const [expedientesModal, setExpedientesModal] = useState<Expediente[]>([]);
  const [cargandoModal, setCargandoModal] = useState(false);

  // Búsqueda en la tabla
  const [busqueda, setBusqueda] = useState("");
  const [expedientesVisibles, setExpedientesVisibles] = useState<Expediente[]>([]);
  const [notasSemanales, setNotasSemanales] = useState<NotaCalendario[]>([]);

  const alternarMenuIzquierda = () => setMenuIzquierdaAbierto((est) => !est);
  const cerrarMenuIzquierda = () => setMenuIzquierdaAbierto(false);


  // Cargar datos desde el Backend
  useEffect(() => {
    apiFetch("http://localhost:4000/api/dashboard/estadisticas")
      .then((res) => res.json())
      .then((data) => {
        const stats = data.estadisticas || {};
        setDatosDashboard({
          estadisticas: {
            Total: stats.total || 0,
            Catastro: stats.catastro || 0,
            Presupuesto: stats.presupuesto || 0,
            Relevamiento: stats.relevamiento || 0,
            Plano: stats.plano || 0,
            Presentacion: stats.presentacion || 0,
            Certificado: stats.certificado || 0,
            Visado: stats.visado || 0,
            Mojones: stats.mojones || 0,
            Archivo: stats.archivo || 0,
          },
          expedientesRecientes: data.expedientesRecientes || [],
          alertas: data.alertas || [],
        });
        setExpedientesVisibles(data.expedientesRecientes || []);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error cargando dashboard:", err);
        setDatosDashboard({
          estadisticas: {
            Total: 0, Catastro: 0, Presupuesto: 0, Relevamiento: 0,
            Plano: 0, Presentacion: 0, Certificado: 0, Visado: 0,
            Mojones: 0, Archivo: 0
          },
          expedientesRecientes: [],
          alertas: []
        });
        setCargando(false);
      });

    // Cargar notas del calendario de la semana actual
    const hoy = new Date();
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - (hoy.getDay() === 0 ? 6 : hoy.getDay() - 1));
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);

    const inicio = lunes.toISOString().split('T')[0];
    const fin = domingo.toISOString().split('T')[0];

    apiFetch(`http://localhost:4000/api/calendario/rango?inicio=${inicio}&fin=${fin}`)
      .then(res => res.json())
      .then(data => setNotasSemanales(data))
      .catch(err => console.error("Error cargando notas semanales:", err));
  }, []);

  // Cargar expedientes para el modal cuando cambia la etapa seleccionada
  useEffect(() => {
    if (modalEtapa) {
      setCargandoModal(true);
      apiFetch(`http://localhost:4000/api/dashboard/expedientes/${modalEtapa}`)
        .then(res => res.json())
        .then(data => {
          setExpedientesModal(data);
          setCargandoModal(false);
        })
        .catch(err => {
          console.error("Error cargando lista de etapa:", err);
          setExpedientesModal([]);
          setCargandoModal(false);
        });
    } else {
      setExpedientesModal([]);
    }
  }, [modalEtapa]);

  // Alertar lógica ahora viene del backend en datosDashboard.alertas
  const alertasFiltradas = datosDashboard.alertas.length > 6 ? datosDashboard.alertas.slice(-6) : datosDashboard.alertas;

  useEffect(() => {
    if (!busqueda.trim()) {
      setExpedientesVisibles(datosDashboard.expedientesRecientes);
      return;
    }

    const timer = setTimeout(() => {
      apiFetch(`http://localhost:4000/api/dashboard/buscar?termino=${busqueda}`)
        .then(res => res.json())
        .then(data => {
          setExpedientesVisibles(data || []);
        })
        .catch(err => console.error("Error buscando:", err));
    }, 300);

    return () => clearTimeout(timer);
  }, [busqueda, datosDashboard.expedientesRecientes]);

  const marcarAlertaVista = async (id: number) => {
    try {
      await apiFetch(`http://localhost:4000/api/alertas/${id}/visto`, { method: 'PUT' });
      // Actualizar estado local
      setDatosDashboard(prev => ({
        ...prev,
        alertas: prev.alertas.filter(a => a.id !== id)
      }));
    } catch (error) {
      console.error("Error al marcar alerta como vista:", error);
    }
  };

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

  const etapas: Etapa[] = [
    "Presupuesto",
    "Relevamiento",
    "Plano",
    "Previa DGC",
    "Certificado",
    "Visado",
    "Mojones",
  ];

  const renderStatus = (status: any) => {
    if (status === "process") {
      return (
        <span className="status-proceso" title="En proceso">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#fbc02d' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </span>
      );
    }
    if (status === true || status === "tick") {
      return <span className="status-tick">✓</span>;
    }
    return <span className="status-falta">✕</span>;
  };

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
          <h2>Alertas e Información</h2>
          <div className="alertas-grid">
            {alertasFiltradas.map((a, i) => (
              <div
                key={i}
                className={`alerta-card alerta-${a.tipo.toLowerCase()}`}
                onClick={() => a.expedienteId && navigate(`/expedientes/detalle/${a.expedienteId}`)}
                style={{ cursor: a.expedienteId ? 'pointer' : 'default', position: 'relative' }}
                title={a.notas}
              >
                {a.esPersonalizada && a.id && (
                  <button
                    className="boton-cerrar-alerta"
                    onClick={(e) => { e.stopPropagation(); marcarAlertaVista(a.id!); }}
                    style={{ position: 'absolute', right: '5px', top: '5px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', opacity: 0.6 }}
                  >✕</button>
                )}
                <div className="alerta-tipo">
                  {a.tipo} {a.fecha && <span style={{ fontSize: '0.85rem', opacity: 0.8, marginLeft: '5px' }}>({a.fecha})</span>}
                </div>
                <div className="alerta-desc">{a.descripcion}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-seccion" style={{ padding: '8px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', whiteSpace: 'nowrap' }}>Seguimiento por Expediente</h2>
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  fontSize: '1rem',
                  width: '100%',
                  maxWidth: '280px',
                  outline: 'none',
                  background: 'rgba(255,255,255,0.6)'
                }}
              />
            </div>
          </div>

          <div className="tabla-contenedor">
            <table className="tabla tabla-resumen-prolija">
              <thead>
                <tr>
                  <th>Cliente</th>
                  {etapas.map(e => <th key={e} style={{ textAlign: 'center', minWidth: '90px' }}>{e}</th>)}
                </tr>
              </thead>
              <tbody>
                {expedientesVisibles.map((exp) => (
                  <tr
                    key={exp.id}
                    onClick={() => navigate(`/expedientes/detalle/${exp.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '1.05rem', lineHeight: 1.2 }}>{exp.cliente}</div>
                    </td>
                    {etapas.map(etapa => (
                      <td key={etapa} style={{ textAlign: 'center' }}>
                        {renderStatus(exp.etapasStatus?.[etapa])}
                      </td>
                    ))}
                  </tr>
                ))}
                {expedientesVisibles.length === 0 && !cargando && (
                  <tr>
                    <td colSpan={etapas.length + 1} style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                      No se encontraron expedientes recientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {cargando && <p style={{ textAlign: 'center', padding: '20px' }}>Cargando datos reales...</p>}
          </div>
        </section>

        <section className="dashboard-seccion seccion-notas-semanales">
          <h2>Notas del Calendario (Esta Semana)</h2>
          <div className="notas-semanales-grid">
            {notasSemanales.length > 0 ? (
              notasSemanales.map((nota) => (
                <div key={nota.id} className="nota-semanal-card">
                  <div className="nota-semanal-fecha">
                    {new Date(nota.fecha + "T12:00:00").toLocaleDateString("es-AR", { weekday: 'long', day: 'numeric', month: 'short' })}
                  </div>
                  <div className="nota-semanal-contenido">{nota.contenido}</div>
                </div>
              ))
            ) : (
              <div className="nota-vacia">No hay notas registradas para esta semana.</div>
            )}
          </div>
        </section>
      </div>

      {modalEtapa && (
        <div className="modal-etapa-overlay" onClick={() => setModalEtapa(null)}>
          <div className="modal-etapa-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="modal-etapa-header">
              <h3>Expedientes en {modalEtapa}</h3>
              <button className="boton-cerrar-modal" onClick={() => setModalEtapa(null)}>✕</button>
            </div>
            <div className="modal-etapa-lista">
              <table className="tabla">
                <thead>
                  <tr>
                    <th>Nº</th>
                    <th>Cliente</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {cargandoModal ? (
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                        Cargando expedientes...
                      </td>
                    </tr>
                  ) : (
                    <>
                      {expedientesModal.map((exp) => (
                        <tr key={exp.id}>
                          <td>{exp.numero}</td>
                          <td>{exp.cliente}</td>
                          <td>
                            <Link
                              className="boton-link"
                              to={`/expedientes/detalle/${exp.id}`}
                              onClick={() => setModalEtapa(null)}
                            >
                              Ver
                            </Link>
                          </td>
                        </tr>
                      ))}
                      {expedientesModal.length === 0 && (
                        <tr>
                          <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                            No hay expedientes en esta etapa o todavía no se ha implementado la lógica para "{modalEtapa}".
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <BarraLateralIzquierda abierto={menuIzquierdaAbierto} alCerrar={cerrarMenuIzquierda} />
    </>

  );
}
