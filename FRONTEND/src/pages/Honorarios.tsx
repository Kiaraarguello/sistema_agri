import { useState, useEffect } from "react";
import BarraLateralIzquierda from "./BarraLateralIzquierda";
import "../estilos/Honorarios.css";

import type { Categoria, Servicio, Nota } from "../data/honorariosData";

export default function Honorarios() {
    // --- Estados Principales ---
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
    const [cargando, setCargando] = useState(true);

    // --- Datos Cargados ---
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [notasGenerales, setNotasGenerales] = useState<Nota[]>([]);

    useEffect(() => {
        cargarHonorarios();
    }, []);

    const cargarHonorarios = () => {
        setCargando(true);
        // Cargar categorías
        fetch("http://localhost:4000/api/honorarios")
            .then(res => res.json())
            .then(data => {
                const ordenadas = [...data].sort((a, b) => a.tipo.localeCompare(b.tipo, undefined, { numeric: true, sensitivity: 'base' }));
                setCategorias(ordenadas);
            })
            .catch(err => console.error("Error al cargar honorarios:", err));

        // Cargar notas
        fetch("http://localhost:4000/api/honorarios/notas")
            .then(res => res.json())
            .then(data => {
                setNotasGenerales(data);
                setCargando(false);
            })
            .catch(err => {
                console.error("Error al cargar notas:", err);
                setCargando(false);
            });
    };

    const guardarPermanente = () => {
        // Guardar categorías
        const prom1 = fetch("http://localhost:4000/api/honorarios/sincronizar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(categorias)
        });

        // Guardar notas
        const prom2 = fetch("http://localhost:4000/api/honorarios/notas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(notasGenerales)
        });

        Promise.all([prom1, prom2])
            .then(() => {
                alert("Cambios guardados con éxito");
                setModoEdicion(false);
                cargarHonorarios();
            })
            .catch(err => {
                console.error("Error al guardar:", err);
                alert("Error al guardar los cambios");
            });
    };

    // --- Funciones CRUD ---

    const agregarCategoria = () => {
        const nueva: Categoria = { id: Date.now(), tipo: "Nuevo Tipo", servicios: [], otros: "" };
        setCategorias([nueva, ...categorias]);
        setCategoriaSeleccionada(nueva.id);
    };

    const eliminarCategoria = (id: number) => {
        if (window.confirm("¿Borrar categoría completa?")) {
            setCategorias(categorias.filter(c => c.id !== id));
            if (categoriaSeleccionada === id) setCategoriaSeleccionada(null);
        }
    };

    const agregarServicio = (catId: number) => {
        const nuevo: Servicio = {
            id: Date.now(),
            codigo: "",
            nombre: "Nuevo servicio",
            montoBase: 0,
            unidadBase: "",
            montoVariable: 0,
            unidadVariable: "",
            montoVariable2: 0,
            unidadVariable2: "",
            montoPorcentaje: 0,
            porcentaje: 0,
            observaciones: "",
            esTitulo: false
        };
        setCategorias(categorias.map(c => c.id === catId ? { ...c, servicios: [...c.servicios, nuevo] } : c));
    };

    const editarServicio = (catId: number, servId: number, campo: keyof Servicio, valor: any) => {
        setCategorias(categorias.map(c => {
            if (c.id === catId) {
                return { ...c, servicios: c.servicios.map(s => s.id === servId ? { ...s, [campo]: valor } : s) };
            }
            return c;
        }));
    };

    const eliminarServicio = (catId: number, servId: number) => {
        setCategorias(categorias.map(c => {
            if (c.id === catId) {
                return { ...c, servicios: c.servicios.filter(s => s.id !== servId) };
            }
            return c;
        }));
    };

    const editarNota = (id: number, contenido: string) => {
        setNotasGenerales(notasGenerales.map(n => n.id === id ? { ...n, contenido } : n));
    };

    const agregarNota = () => {
        const nueva: Nota = { id: Date.now(), contenido: "", orden: notasGenerales.length + 1 };
        setNotasGenerales([...notasGenerales, nueva]);
    };

    const eliminarNota = (id: number) => {
        setNotasGenerales(notasGenerales.filter(n => n.id !== id));
    };

    const toggleCategoria = (id: number) => {
        setCategoriaSeleccionada(categoriaSeleccionada === id ? null : id);
    };

    if (cargando) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--principal)' }}>
                <h3>Cargando Honorarios...</h3>
            </div>
        );
    }

    return (
        <div className="honorarios-pagina">
            <BarraLateralIzquierda abierto={menuAbierto} alCerrar={() => setMenuAbierto(false)} />

            <header className="honorarios-header no-print">
                <button className="boton-menu-unificado" onClick={() => setMenuAbierto(true)}>☰</button>
                <div className="honorarios-titulo-seccion">
                    <h1>Honorarios Profesionales</h1>
                    <p>Carga y administración de servicios según valores vigentes.</p>
                </div>
                <div className="honorarios-controles" style={{ display: 'flex', gap: '10px' }}>
                    {modoEdicion ? (
                        <>
                            <button className="boton-accion boton-accion-secundario" onClick={() => { setModoEdicion(false); cargarHonorarios(); }}>Cancelar</button>
                            <button className="boton-accion boton-edicion-on" onClick={guardarPermanente}>Finalizar y Guardar</button>
                        </>
                    ) : (
                        <button className="boton-accion boton-edicion-off" onClick={() => setModoEdicion(true)}>Modificar Precios</button>
                    )}
                </div>
            </header>

            {modoEdicion && (
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <button className="boton-accion boton-accion-primario" onClick={agregarCategoria} style={{ margin: '0 auto' }}>
                        + Agregar Nueva Categoría Principal
                    </button>
                </div>
            )}

            <div className="categorias-lista">
                {categorias.map(cat => (
                    <div key={cat.id} className={`categoria-item ${categoriaSeleccionada === cat.id ? 'abierto' : ''}`}>
                        <div className="categoria-header-acordeon" onClick={() => toggleCategoria(cat.id)}>
                            <div className="categoria-header-info">
                                {modoEdicion ? (
                                    <input className="input-tabla" value={cat.tipo} onChange={e => setCategorias(categorias.map(c => c.id === cat.id ? { ...c, tipo: e.target.value } : c))} onClick={e => e.stopPropagation()} style={{ fontSize: '1rem', width: 'auto' }} />
                                ) : (
                                    <h3 className="categoria-titulo">{cat.tipo}</h3>
                                )}
                                <span className="categoria-conteo">{cat.servicios.length} items</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {modoEdicion && <button className="btn-mini btn-borrar" onClick={e => { e.stopPropagation(); eliminarCategoria(cat.id); }}>✕</button>}
                                <span className="categoria-flecha">▼</span>
                            </div>
                        </div>

                        <div className="categoria-contenido">
                            <table className="tabla-servicios">
                                <thead>
                                    <tr>
                                        <th style={{ width: '80px' }}>Código</th>
                                        <th>Descripción del Servicio</th>
                                        <th style={{ width: '250px' }}>Honorario / Suma</th>
                                        <th style={{ width: '180px' }}>Porcentaje</th>
                                        <th>Observaciones</th>
                                        {modoEdicion && <th style={{ width: '100px' }}>Acciones</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {cat.servicios.map(serv => (
                                        <tr key={serv.id} className={`servicio-fila ${serv.esTitulo ? 'es-titulo-fila' : ''}`}>
                                            <td>
                                                {modoEdicion ? (
                                                    <input className="input-tabla" value={serv.codigo} onChange={e => editarServicio(cat.id, serv.id, "codigo", e.target.value)} />
                                                ) : (
                                                    <span style={{ fontWeight: 700, color: '#888' }}>{serv.codigo}</span>
                                                )}
                                            </td>
                                            <td className="servicio-nombre-td">
                                                {modoEdicion ? (
                                                    <input className="input-tabla" value={serv.nombre} onChange={e => editarServicio(cat.id, serv.id, "nombre", e.target.value)} />
                                                ) : (
                                                    serv.nombre
                                                )}
                                            </td>
                                            <td>
                                                {serv.esTitulo ? null : (modoEdicion ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <span style={{ fontSize: '0.8rem' }}>Base $</span>
                                                            <input type="number" className="input-tabla" value={serv.montoBase} onChange={e => editarServicio(cat.id, serv.id, "montoBase", Number(e.target.value))} />
                                                            <input className="input-tabla" placeholder="unidad" value={serv.unidadBase} onChange={e => editarServicio(cat.id, serv.id, "unidadBase", e.target.value)} />
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <span style={{ fontSize: '0.8rem' }}>+ $</span>
                                                            <input type="number" className="input-tabla" value={serv.montoVariable} onChange={e => editarServicio(cat.id, serv.id, "montoVariable", Number(e.target.value))} />
                                                            <input className="input-tabla" placeholder="unidad extra" value={serv.unidadVariable} onChange={e => editarServicio(cat.id, serv.id, "unidadVariable", e.target.value)} />
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <span style={{ fontSize: '0.8rem' }}>+ $</span>
                                                            <input type="number" className="input-tabla" value={serv.montoVariable2} onChange={e => editarServicio(cat.id, serv.id, "montoVariable2", Number(e.target.value))} />
                                                            <input className="input-tabla" placeholder="unidad extra 2" value={serv.unidadVariable2} onChange={e => editarServicio(cat.id, serv.id, "unidadVariable2", e.target.value)} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="monto-complejo">
                                                        <span className="monto-base">$ {serv.montoBase.toLocaleString()} <small style={{ fontWeight: 400, color: '#999' }}>{serv.unidadBase}</small></span>
                                                        {serv.montoVariable > 0 && <span className="monto-adicional">+ $ {serv.montoVariable.toLocaleString()} {serv.unidadVariable}</span>}
                                                        {serv.montoVariable2 > 0 && <span className="monto-adicional">+ $ {serv.montoVariable2.toLocaleString()} {serv.unidadVariable2}</span>}
                                                    </div>
                                                ))}
                                            </td>
                                            <td>
                                                {serv.esTitulo ? null : (modoEdicion ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <span style={{ fontSize: '0.8rem' }}>Monto $</span>
                                                            <input type="number" className="input-tabla" value={serv.montoPorcentaje} onChange={e => editarServicio(cat.id, serv.id, "montoPorcentaje", Number(e.target.value))} />
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <span style={{ fontSize: '0.8rem' }}>%</span>
                                                            <input type="number" className="input-tabla" value={serv.porcentaje} onChange={e => editarServicio(cat.id, serv.id, "porcentaje", Number(e.target.value))} />
                                                            <span style={{ fontSize: '0.7rem', color: '#666' }}>({((serv.montoPorcentaje * serv.porcentaje) / 100).toLocaleString()})</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>$ {((serv.montoPorcentaje * serv.porcentaje) / 100).toLocaleString()}</span>
                                                        <small style={{ color: '#888' }}>{serv.porcentaje}% de {serv.montoPorcentaje.toLocaleString()}</small>
                                                    </div>
                                                ))}
                                            </td>
                                            <td>
                                                {modoEdicion ? (
                                                    <input className="input-tabla" value={serv.observaciones} onChange={e => editarServicio(cat.id, serv.id, "observaciones", e.target.value)} placeholder="Notas..." />
                                                ) : (
                                                    <span className="observacion-texto">{serv.observaciones}</span>
                                                )}
                                            </td>
                                            {modoEdicion && (
                                                <td>
                                                    <button className="btn-mini btn-borrar" onClick={() => eliminarServicio(cat.id, serv.id)}>✕</button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {modoEdicion && (
                                <div style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                                    <button className="boton-accion boton-accion-secundario" onClick={() => agregarServicio(cat.id)}>+ Servicio</button>
                                </div>
                            )}

                            {/* Footer de "Otros" - Ahora dentro de contenido para que se oculte al cerrar */}
                            <div className="categoria-footer-otros">
                                <div className="otros-navbar">
                                    <span className="otros-titulo">Otros:</span>
                                    {modoEdicion ? (
                                        <textarea
                                            className="otros-textarea"
                                            value={cat.otros || ""}
                                            placeholder="Anotar observaciones generales (soporta múltiples líneas)..."
                                            onChange={e => setCategorias(categorias.map(c => c.id === cat.id ? { ...c, otros: e.target.value } : c))}
                                            rows={2}
                                        />
                                    ) : (
                                        <div className="otros-texto">{cat.otros || "Sin observaciones adicionales."}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* SECCIÓN DE NOTAS GENERALES */}
            <div className="notas-honorarios-contenedor">
                <div className="notas-honorarios-card">
                    <div className="notas-honorarios-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2>📌 Notas y Aclaraciones Generales</h2>
                            <p>Condiciones y pautas administrativas de los honorarios profecionales.</p>
                        </div>
                        {modoEdicion && (
                            <button className="boton-accion boton-accion-secundario" onClick={agregarNota}>
                                + Agregar Nota
                            </button>
                        )}
                    </div>
                    <div className="notas-honorarios-cuerpo">
                        {notasGenerales.map((nota, index) => (
                            <div key={nota.id} className="nota-item-renglon">
                                <span className="nota-numero">{index + 1}.</span>
                                {modoEdicion ? (
                                    <div style={{ display: 'flex', gap: '10px', width: '100%', alignItems: 'center' }}>
                                        <input
                                            className="input-nota-directo"
                                            value={nota.contenido}
                                            onChange={e => editarNota(nota.id, e.target.value)}
                                            placeholder={`Nota ${index + 1}...`}
                                        />
                                        <button className="btn-mini btn-borrar" onClick={() => eliminarNota(nota.id)}>✕</button>
                                    </div>
                                ) : (
                                    <p className="nota-texto">{nota.contenido || "---"}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
