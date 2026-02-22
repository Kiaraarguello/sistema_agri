import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BarraLateralIzquierda from "../pages/BarraLateralIzquierda";
import { apiFetch } from "../utils/api";
import "../estilos/Calendario.css";

/**
 * COMPONENTE DE CALENDARIO MENSUAL
 * Permite visualizar el mes actual, navegar entre meses y añadir notas por día y alertas.
 */

// Estructura de una nota
interface Nota {
    id?: number;
    fecha: string; // Formato YYYY-MM-DD
    contenido: string;
}

interface Alerta {
    id?: number;
    titulo: string;
    fecha: string;
    hora?: string;
    expediente_id?: number | null;
    notas?: string;
    expediente_objeto?: string;
    visto?: boolean;
}

export default function Calendario() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }
    }, [navigate]);

    const [menuAbierto, setMenuAbierto] = useState(false);
    const [fechaActual, setFechaActual] = useState(new Date());
    const [notas, setNotas] = useState<Nota[]>([]);
    const [cargando, setCargando] = useState(false);

    // Estados para el modal de edición de notas
    const [modalAbierto, setModalAbierto] = useState(false);
    const [diaSeleccionado, setDiaSeleccionado] = useState<Date | null>(null);
    const [contenidoTemp, setContenidoTemp] = useState("");

    // Estados para el modal de Alertas
    const [modalAlertaAbierto, setModalAlertaAbierto] = useState(false);
    const [alertas, setAlertas] = useState<Alerta[]>([]);
    const [nuevaAlerta, setNuevaAlerta] = useState({
        titulo: "",
        fecha: new Date().toISOString().split('T')[0],
        hora: "",
        expediente_id: null as number | null,
        notas: ""
    });
    const [busquedaExp, setBusquedaExp] = useState("");
    const [resBusqueda, setResBusqueda] = useState<any[]>([]);
    const [expedienteSeleccionadoData, setExpedienteSeleccionadoData] = useState<any>(null);
    const [alertaEditandoId, setAlertaEditandoId] = useState<number | null>(null);

    // --- 1. CARGA DE DATOS ---
    useEffect(() => {
        cargarNotas();
        cargarAlertas();
    }, [fechaActual]);

    const cargarNotas = async () => {
        setCargando(true);
        try {
            const res = await apiFetch(`http://localhost:4000/api/calendario?mes=${fechaActual.getMonth() + 1}&anio=${fechaActual.getFullYear()}`);
            const data = await res.json();
            setNotas(data);
        } catch (e) {
            console.error("Error cargando notas del calendario:", e);
        } finally {
            setCargando(false);
        }
    };

    const cargarAlertas = async () => {
        try {
            const res = await apiFetch(`http://localhost:4000/api/alertas/inicio`);
            const data = await res.json();
            setAlertas(data);
        } catch (e) {
            console.error("Error cargando alertas:", e);
        }
    };

    // --- 2. LÓGICA DE DÍAS DEL CALENDARIO ---
    const obtenerDiasDelMes = () => {
        const anio = fechaActual.getFullYear();
        const mes = fechaActual.getMonth();
        const primerDia = new Date(anio, mes, 1);
        const ultimoDia = new Date(anio, mes + 1, 0);
        const dias = [];
        const diaSemanaInicio = primerDia.getDay();
        for (let i = diaSemanaInicio; i > 0; i--) {
            dias.push({ fecha: new Date(anio, mes, 1 - i), esDelMes: false });
        }
        for (let d = 1; d <= ultimoDia.getDate(); d++) {
            dias.push({ fecha: new Date(anio, mes, d), esDelMes: true });
        }

        // Calculamos cuántas celdas necesitamos (35 o 42)
        // 5 filas (35 celdas) es lo ideal, pero algunos meses necesitan 6 filas (42 celdas).
        const totalCeldas = dias.length > 35 ? 42 : 35;

        while (dias.length < totalCeldas) {
            const ultima: Date = dias[dias.length - 1].fecha;
            const proxima: Date = new Date(ultima.getFullYear(), ultima.getMonth(), ultima.getDate() + 1);
            dias.push({ fecha: proxima, esDelMes: false });
        }
        return dias;
    };

    // --- 3. ACCIONES ---
    const cambiarMes = (offset: number) => {
        const nuevaFecha = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + offset, 1);
        setFechaActual(nuevaFecha);
    };

    const irAHoy = () => setFechaActual(new Date());

    const abrirEditor = (dia: Date) => {
        const fechaStr = dia.toISOString().split('T')[0];
        const notaExistente = notas.find((n: Nota) => n.fecha === fechaStr);
        setDiaSeleccionado(dia);
        setContenidoTemp(notaExistente ? notaExistente.contenido : "");
        setModalAbierto(true);
    };

    const guardarNota = async () => {
        if (!diaSeleccionado) return;
        const fechaStr = diaSeleccionado.toISOString().split('T')[0];
        try {
            await apiFetch("http://localhost:4000/api/calendario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fecha: fechaStr, contenido: contenidoTemp })
            });
            setModalAbierto(false);
            cargarNotas();
        } catch (e) {
            console.error("Error al guardar nota:", e);
            alert("No se pudo guardar la nota.");
        }
    };

    const buscarExpedientes = async (val: string) => {
        setBusquedaExp(val);
        if (val.length < 2) {
            setResBusqueda([]);
            return;
        }
        try {
            const res = await apiFetch(`http://localhost:4000/api/dashboard/buscar?termino=${val}`);
            const data = await res.json();
            setResBusqueda(data || []);
        } catch (e) {
            console.error("Error buscando expedientes:", e);
        }
    };

    const selecionarExpediente = (exp: any) => {
        setNuevaAlerta({ ...nuevaAlerta, expediente_id: Number(exp.id) });
        setExpedienteSeleccionadoData(exp);
        setResBusqueda([]);
        setBusquedaExp("");
    };

    const iniciarEdicionAlerta = (alerta: Alerta) => {
        setAlertaEditandoId(alerta.id || null);
        setNuevaAlerta({
            titulo: alerta.titulo,
            fecha: alerta.fecha ? alerta.fecha.split('T')[0] : new Date().toISOString().split('T')[0],
            hora: alerta.hora || "",
            expediente_id: alerta.expediente_id || null,
            notas: alerta.notas || ""
        });
        if (alerta.expediente_id) {
            setExpedienteSeleccionadoData({ id: alerta.expediente_id, objeto: alerta.expediente_objeto || "Expediente vinculado" });
        } else {
            setExpedienteSeleccionadoData(null);
        }
        setModalAlertaAbierto(true);
    };

    const eliminarAlerta = async (id: number) => {
        if (!confirm("¿Estás seguro de que deseas eliminar esta alerta?")) return;
        try {
            await apiFetch(`http://localhost:4000/api/alertas/${id}`, {
                method: "DELETE"
            });
            cargarAlertas();
        } catch (e) {
            console.error("Error al eliminar alerta:", e);
            alert("No se pudo eliminar la alerta.");
        }
    };

    const guardarAlerta = async () => {
        if (!nuevaAlerta.titulo || !nuevaAlerta.fecha) {
            alert("Título y fecha son obligatorios");
            return;
        }
        try {
            const url = alertaEditandoId
                ? `http://localhost:4000/api/alertas/${alertaEditandoId}`
                : "http://localhost:4000/api/alertas";

            await apiFetch(url, {
                method: alertaEditandoId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevaAlerta)
            });
            setModalAlertaAbierto(false);
            setAlertaEditandoId(null);
            setNuevaAlerta({ titulo: "", fecha: new Date().toISOString().split('T')[0], hora: "", expediente_id: null, notas: "" });
            setExpedienteSeleccionadoData(null);
            cargarAlertas();
        } catch (e) {
            console.error("Error al guardar alerta:", e);
            alert("No se pudo guardar la alerta.");
        }
    };

    // --- 4. RENDERIZADO ---
    const dias = obtenerDiasDelMes();
    const nombreMes = fechaActual.toLocaleString("es", { month: "long" });
    const diaHoy = new Date().toISOString().split('T')[0];

    return (
        <div className="calendario-pagina">
            <BarraLateralIzquierda abierto={menuAbierto} alCerrar={() => setMenuAbierto(false)} />

            <header className="calendario-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button className="boton-menu-unificado" onClick={() => setMenuAbierto(true)}>☰</button>
                    <h1 className="calendario-titulo">{nombreMes} {fechaActual.getFullYear()}</h1>
                    {cargando && <span style={{ fontSize: '0.8rem', color: 'rgba(var(--principal-rgb), 1)' }}>• Cargando...</span>}
                </div>

                <div className="calendario-controles">
                    <button className="boton-cal" onClick={() => setModalAlertaAbierto(true)} style={{ background: 'rgba(var(--principal-rgb), 0.85)', color: 'white', marginRight: '20px', border: 'none' }}>+ Crear Alerta</button>
                    <button className="boton-cal" onClick={() => cambiarMes(-1)}>← Anterior</button>
                    <button className="boton-cal boton-cal-hoy" onClick={irAHoy}>Hoy</button>
                    <button className="boton-cal" onClick={() => cambiarMes(1)}>Siguiente →</button>
                </div>
            </header>

            <div className="calendario-grid-contenedor">
                <div className="calendario-dias-semana">
                    {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(d => (
                        <div key={d} className="dia-semana">{d}</div>
                    ))}
                </div>

                <div className="calendario-grid">
                    {dias.map((d, i) => {
                        const fechaStr = d.fecha.toISOString().split('T')[0];
                        const esHoy = fechaStr === diaHoy;
                        const notasDelDia = notas.filter((n: Nota) => n.fecha === fechaStr);
                        const alertasDelDia = alertas.filter((a: Alerta) => a.fecha?.split('T')[0] === fechaStr);

                        return (
                            <div
                                key={i}
                                className={`calendario-celda ${!d.esDelMes ? 'fuera-mes' : ''} ${esHoy ? 'es-hoy' : ''}`}
                                onClick={() => d.esDelMes && abrirEditor(d.fecha)}
                            >
                                <div className="celda-numero">{d.fecha.getDate()}</div>
                                <div className="calendario-notes-lista">
                                    {notasDelDia.map((n: Nota, idx: number) => (
                                        <div key={idx} className="nota-item">{n.contenido}</div>
                                    ))}
                                    {alertasDelDia.map((a: Alerta, idx: number) => (
                                        <div key={`al-${idx}`} className="nota-item alerta-item" title={a.notas} style={{ background: 'rgba(255, 193, 7, 0.2)', color: '#856404', borderLeft: '3px solid #ffc107', marginTop: '2px', padding: '1px 5px', borderRadius: '3px', fontSize: '0.75rem' }}>
                                            🔔 {a.hora ? `[${a.hora}] ` : ""}{a.titulo}
                                        </div>
                                    ))}
                                    {(notasDelDia.length + alertasDelDia.length) > 3 && <div className="indicador-mas">...</div>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal para editar nota del día */}
            {modalAbierto && (
                <div className="modal-nota-overlay" onClick={() => setModalAbierto(false)}>
                    <div className="modal-nota-contenido" onClick={e => e.stopPropagation()}>
                        <button className="boton-cerrar" onClick={() => setModalAbierto(false)}>✕</button>
                        <div className="modal-nota-header">
                            <h3>Nota del Día</h3>
                            <p>{diaSeleccionado?.toLocaleDateString("es", { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                        </div>

                        {/* Mostrar alertas del día si existen */}
                        {diaSeleccionado && (() => {
                            const fechaStr = diaSeleccionado.toISOString().split('T')[0];
                            const alertasDelDia = alertas.filter((a: Alerta) => a.fecha?.split('T')[0] === fechaStr);

                            return (
                                <div style={{ marginBottom: '20px', border: '1px solid rgba(var(--principal-rgb), 0.1)', borderRadius: '12px', padding: '15px', background: 'rgba(var(--principal-rgb), 0.02)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--principal)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            🔔 Alertas Programadas ({alertasDelDia.length})
                                        </h4>
                                        <button
                                            className="boton-cal"
                                            style={{ padding: '4px 10px', fontSize: '0.8rem', background: 'rgba(var(--principal-rgb), 0.1)', color: 'var(--principal)', border: 'none' }}
                                            onClick={() => {
                                                setAlertaEditandoId(null);
                                                setNuevaAlerta({
                                                    titulo: "",
                                                    fecha: fechaStr,
                                                    hora: "",
                                                    expediente_id: null,
                                                    notas: ""
                                                });
                                                setExpedienteSeleccionadoData(null);
                                                setModalAlertaAbierto(true);
                                            }}
                                        >
                                            + Nueva Alerta
                                        </button>
                                    </div>

                                    {alertasDelDia.length > 0 ? (
                                        <div style={{ maxHeight: '150px', overflowY: 'auto', paddingRight: '5px' }}>
                                            {alertasDelDia.map((a: Alerta, i: number) => (
                                                <div key={i} style={{ background: 'white', border: '1px solid rgba(255, 193, 7, 0.3)', borderLeft: '4px solid #ffc107', padding: '10px', marginBottom: '8px', borderRadius: '8px', position: 'relative', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#533f03', flex: 1 }}>
                                                            {a.hora ? <span style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.05)', padding: '1px 4px', borderRadius: '3px', marginRight: '5px' }}>{a.hora}</span> : ""}{a.titulo}
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '10px', marginLeft: '10px' }}>
                                                            <button onClick={() => iniciarEdicionAlerta(a)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }} title="Editar Alerta">✏️</button>
                                                            <button onClick={() => a.id && eliminarAlerta(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }} title="Eliminar Alerta">🗑️</button>
                                                        </div>
                                                    </div>
                                                    {a.notas && <div style={{ fontSize: '0.85rem', color: '#664d03', marginTop: '4px', whiteSpace: 'pre-wrap' }}>{a.notas}</div>}
                                                    {a.expediente_id && <div style={{ fontSize: '0.8rem', color: '#856404', marginTop: '6px', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px', borderTop: '1px dashed rgba(133, 100, 4, 0.2)', paddingTop: '4px' }}>
                                                        📁 Exp: <strong>#{a.expediente_id}</strong>
                                                    </div>}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#888', fontStyle: 'italic', textAlign: 'center', padding: '10px' }}>No hay alertas para este día.</p>
                                    )}
                                </div>
                            );
                        })()}
                        <textarea
                            className="textarea-nota"
                            placeholder="Escribe lo que necesites anotar para este día..."
                            value={contenidoTemp}
                            onChange={e => setContenidoTemp(e.target.value)}
                            autoFocus
                        />
                        <div className="modal-acciones">
                            <button className="boton-cal" onClick={() => setModalAbierto(false)}>Cancelar</button>
                            <button className="boton-cal boton-cal-hoy" onClick={guardarNota}>Guardar Nota</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para Crear Alerta */}
            {modalAlertaAbierto && (
                <div className="modal-nota-overlay" onClick={() => setModalAlertaAbierto(false)}>
                    <div className="modal-nota-contenido" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <button className="boton-cerrar" onClick={() => setModalAlertaAbierto(false)}>✕</button>
                        <div className="modal-nota-header">
                            <h3>{alertaEditandoId ? "Editar Alerta" : "Crear Nueva Alerta"}</h3>
                            <p>{alertaEditandoId ? "Modifica los detalles de este recordatorio" : "Asigna un recordatorio para una fecha específica"}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Título de la Alerta</label>
                                <input
                                    type="text"
                                    className="input-estilizado"
                                    placeholder="Ej: Entrega de planos, Visita a Catastro..."
                                    value={nuevaAlerta.titulo}
                                    onChange={e => setNuevaAlerta({ ...nuevaAlerta, titulo: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Fecha</label>
                                    <input
                                        type="date"
                                        className="input-estilizado"
                                        value={nuevaAlerta.fecha}
                                        onChange={e => setNuevaAlerta({ ...nuevaAlerta, fecha: e.target.value })}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Hora (Opcional)</label>
                                    <input
                                        type="time"
                                        className="input-estilizado"
                                        value={nuevaAlerta.hora}
                                        onChange={e => setNuevaAlerta({ ...nuevaAlerta, hora: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Asignar Expediente (Opcional)</label>
                                <input
                                    type="text"
                                    className="input-estilizado"
                                    placeholder="Buscar por ID, Cliente o Terreno..."
                                    value={expedienteSeleccionadoData ? `Exp: ${expedienteSeleccionadoData.cliente} - ${expedienteSeleccionadoData.terreno}` : busquedaExp}
                                    onChange={e => buscarExpedientes(e.target.value)}
                                    readOnly={!!expedienteSeleccionadoData}
                                />
                                {expedienteSeleccionadoData && (
                                    <button
                                        onClick={() => { setExpedienteSeleccionadoData(null); setNuevaAlerta({ ...nuevaAlerta, expediente_id: null }) }}
                                        style={{ position: 'absolute', right: '10px', top: '35px', background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}
                                    >Cambiar</button>
                                )}
                                {resBusqueda.length > 0 && (
                                    <div className="dropdown-busqueda">
                                        {resBusqueda.map((exp: any) => (
                                            <div key={exp.id} className="item-busqueda" onClick={() => selecionarExpediente(exp)}>
                                                <strong>#{exp.id}</strong> {exp.cliente} - <small>{exp.terreno}</small>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Notas de la Alerta</label>
                                <textarea
                                    className="textarea-nota"
                                    style={{ minHeight: '80px', marginTop: '5px' }}
                                    placeholder="Detalles adicionales..."
                                    value={nuevaAlerta.notas}
                                    onChange={e => setNuevaAlerta({ ...nuevaAlerta, notas: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="modal-acciones" style={{ marginTop: '20px' }}>
                            <button className="boton-cal" onClick={() => { setModalAlertaAbierto(false); setAlertaEditandoId(null); }}>Cancelar</button>
                            <button className="boton-cal boton-cal-hoy" onClick={guardarAlerta}>{alertaEditandoId ? "Guardar Cambios" : "Crear Alerta"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
