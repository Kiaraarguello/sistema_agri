// Terrenos.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../estilos/Terrenos.css";
import BarraLateralIzquierda from "./BarraLateralIzquierda";

// Tipo de dato: Terreno
type Terreno = {
    id: string;
    nomenclatura: string;
    partida: string;
    lote: string;
    manzana: string;
    superficie: string; // ej: 350 m2
    ubicacion: string;
    localidad: string;
    provincia: string;
    clienteId: string; // Relación con cliente (simulada)
    notas: string;
    fechaAlta: string; // ISO
    pdfCatastro?: string; // nombre del archivo o URL
};

// Modos de la página
type ModoPagina = "listado" | "crear" | "editar" | "ver";

// Formulario (todos los campos menos id y fechaAlta)
type FormularioTerreno = Omit<Terreno, "id" | "fechaAlta">;

// Helpers para fechas e IDs
const obtenerHoyISO = () => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

const generarIdTerreno = () => {
    const aleatorio = Math.random().toString(16).slice(2, 8).toUpperCase();
    return `TER-${aleatorio}`;
};

const normalizarTexto = (texto: string) =>
    texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

// Validación simple
const validarFormulario = (datos: FormularioTerreno) => {
    const errores: Partial<Record<keyof FormularioTerreno, string>> = {};

    if (!datos.nomenclatura.trim()) errores.nomenclatura = "Falta la nomenclatura.";
    if (!datos.ubicacion.trim()) errores.ubicacion = "Ingresá la ubicación.";
    if (!datos.localidad.trim()) errores.localidad = "Falta la localidad.";

    return errores;
};

// Componente Botón Genérico
function Boton({
    variante,
    children,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variante: "principal" | "secundario" | "peligro" }) {
    const clase =
        variante === "principal"
            ? "terrenos-boton terrenos-boton-principal"
            : variante === "peligro"
                ? "terrenos-boton terrenos-boton-peligro"
                : "terrenos-boton terrenos-boton-secundario";

    return (
        <button {...props} className={`${clase} ${props.className ?? ""}`.trim()}>
            {children}
        </button>
    );
}

// Botones con Ícono
function BotonIcono({
    titulo,
    icono,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { titulo: string; icono: "ver" | "editar" | "volver" | "menu" | "detalle" }) {
    const etiqueta =
        icono === "ver"
            ? "Ver"
            : icono === "detalle"
                ? "Detalle"
                : icono === "editar"
                    ? "Editar"
                    : icono === "volver"
                        ? "Volver"
                        : "Menú";

    return (
        <button
            {...props}
            type={props.type ?? "button"}
            className={`terrenos-boton-icono ${props.className ?? ""}`.trim()}
            aria-label={titulo}
            title={titulo}
        >
            <span className="terrenos-boton-icono-texto">{etiqueta}</span>
        </button>
    );
}

// Etiqueta para mostrar datos (solo lectura)
function EtiquetaDato({ titulo, valor }: { titulo: string; valor: string }) {
    return (
        <div className="terrenos-dato">
            <div className="terrenos-dato-titulo">{titulo}</div>
            <div className="terrenos-dato-valor">{valor || "—"}</div>
        </div>
    );
}

// Modal de confirmación genérico
function ModalConfirmacion({
    abierto,
    titulo,
    descripcion,
    textoConfirmar,
    textoCancelar,
    alConfirmar,
    alCancelar,
}: {
    abierto: boolean;
    titulo: string;
    descripcion: string;
    textoConfirmar: string;
    textoCancelar: string;
    alConfirmar: () => void;
    alCancelar: () => void;
}) {
    if (!abierto) return null;

    return (
        <div className="terrenos-modal-overlay" role="dialog" aria-modal="true" aria-label={titulo}>
            <div className="terrenos-modal">
                <div className="terrenos-modal-titulo">{titulo}</div>
                <div className="terrenos-modal-desc">{descripcion}</div>

                <div className="terrenos-modal-acciones">
                    <Boton variante="secundario" onClick={alCancelar}>
                        {textoCancelar}
                    </Boton>
                    <Boton variante="peligro" onClick={alConfirmar}>
                        {textoConfirmar}
                    </Boton>
                </div>
            </div>
        </div>
    );
}

// Formulario de Crear/Editar Terreno
function FormularioTerrenos({
    modo,
    datosIniciales,
    alCancelar,
    alGuardar,
}: {
    modo: "crear" | "editar";
    datosIniciales: FormularioTerreno;
    alCancelar: () => void;
    alGuardar: (datos: FormularioTerreno) => void;
}) {
    const [datos, setDatos] = useState<FormularioTerreno>(datosIniciales);
    const [errores, setErrores] = useState<Partial<Record<keyof FormularioTerreno, string>>>({});
    const [mensajeAyuda, setMensajeAyuda] = useState<string>("");

    useEffect(() => {
        setDatos(datosIniciales);
        setErrores({});
        setMensajeAyuda("");
    }, [datosIniciales]);

    const cambiarCampo = <K extends keyof FormularioTerreno>(campo: K, valor: FormularioTerreno[K]) => {
        setDatos((prev) => ({ ...prev, [campo]: valor }));
        setErrores((prev) => ({ ...prev, [campo]: "" }));
    };

    const manejarSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const erroresNuevos = validarFormulario(datos);
        setErrores(erroresNuevos);

        const hayErrores = Object.values(erroresNuevos).some(Boolean);
        if (hayErrores) {
            setMensajeAyuda("Revisá los campos marcados.");
            return;
        }

        setMensajeAyuda("");
        alGuardar(datos);
    };

    return (
        <section className="terrenos-seccion">
            <div className="terrenos-seccion-header">
                <div>
                    <h2 className="terrenos-h2">{modo === "crear" ? "Nuevo terreno" : "Editar terreno"}</h2>
                    <p className="terrenos-subtitulo">
                        Cargá los datos catastrales y de ubicación.
                    </p>
                </div>

                <div className="terrenos-acciones">
                    <Boton variante="secundario" onClick={alCancelar}>
                        Volver
                    </Boton>
                    <Boton variante="principal" type="submit" form="terrenos-formulario">
                        {modo === "crear" ? "Guardar terreno" : "Guardar cambios"}
                    </Boton>
                </div>
            </div>

            <form id="terrenos-formulario" className="terrenos-form" onSubmit={manejarSubmit}>
                <div className="terrenos-form-grid">
                    <label className="terrenos-label">
                        Nomenclatura Catastral <span className="terrenos-requerido">*</span>
                        <input
                            className={`terrenos-input ${errores.nomenclatura ? "terrenos-input-error" : ""}`}
                            value={datos.nomenclatura}
                            onChange={(e) => cambiarCampo("nomenclatura", e.target.value)}
                            placeholder="Ej: 01-02-03-0456"
                        />
                        {errores.nomenclatura && <span className="terrenos-error">{errores.nomenclatura}</span>}
                    </label>

                    <label className="terrenos-label">
                        Partida / Cuenta
                        <input
                            className="terrenos-input"
                            value={datos.partida}
                            onChange={(e) => cambiarCampo("partida", e.target.value)}
                            placeholder="Ej: 123456"
                        />
                    </label>

                    <label className="terrenos-label">
                        Lote
                        <input
                            className="terrenos-input"
                            value={datos.lote}
                            onChange={(e) => cambiarCampo("lote", e.target.value)}
                            placeholder="Ej: 12"
                        />
                    </label>

                    <label className="terrenos-label">
                        Manzana
                        <input
                            className="terrenos-input"
                            value={datos.manzana}
                            onChange={(e) => cambiarCampo("manzana", e.target.value)}
                            placeholder="Ej: A"
                        />
                    </label>

                    <label className="terrenos-label">
                        Superficie
                        <input
                            className="terrenos-input"
                            value={datos.superficie}
                            onChange={(e) => cambiarCampo("superficie", e.target.value)}
                            placeholder="Ej: 300 m2"
                        />
                    </label>

                    <label className="terrenos-label">
                        ID de Cliente (Relación)
                        <input
                            className="terrenos-input"
                            value={datos.clienteId}
                            onChange={(e) => cambiarCampo("clienteId", e.target.value)}
                            placeholder="Ej: CLI-A1B2C3"
                        />
                    </label>

                    <label className="terrenos-label terrenos-label-ancho">
                        Ubicación <span className="terrenos-requerido">*</span>
                        <input
                            className={`terrenos-input ${errores.ubicacion ? "terrenos-input-error" : ""}`}
                            value={datos.ubicacion}
                            onChange={(e) => cambiarCampo("ubicacion", e.target.value)}
                            placeholder="Calle y número, o referencia"
                        />
                        {errores.ubicacion && <span className="terrenos-error">{errores.ubicacion}</span>}
                    </label>

                    <label className="terrenos-label">
                        Localidad <span className="terrenos-requerido">*</span>
                        <input
                            className={`terrenos-input ${errores.localidad ? "terrenos-input-error" : ""}`}
                            value={datos.localidad}
                            onChange={(e) => cambiarCampo("localidad", e.target.value)}
                            placeholder="Ej: Villa Allende"
                        />
                        {errores.localidad && <span className="terrenos-error">{errores.localidad}</span>}
                    </label>

                    <label className="terrenos-label">
                        Provincia
                        <input
                            className="terrenos-input"
                            value={datos.provincia}
                            onChange={(e) => cambiarCampo("provincia", e.target.value)}
                            placeholder="Ej: Córdoba"
                        />
                    </label>

                    <label className="terrenos-label terrenos-label-ancho">
                        Notas
                        <textarea
                            className="terrenos-textarea"
                            value={datos.notas}
                            onChange={(e) => cambiarCampo("notas", e.target.value)}
                            placeholder="Detalles sobre el relevamiento, acceso, etc."
                            rows={3}
                        />
                    </label>

                    <label className="terrenos-label terrenos-label-ancho">
                        PDF Catastro
                        <div className="terrenos-file-upload">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        // Simulamos la subida guardando el nombre del archivo
                                        cambiarCampo("pdfCatastro" as any, file.name);
                                    }
                                }}
                                style={{ display: 'none' }}
                                id="pdf-catastro-upload"
                            />
                            <label htmlFor="pdf-catastro-upload" className="terrenos-boton terrenos-boton-secundario" style={{ display: 'inline-block', cursor: 'pointer' }}>
                                📁 {datos.pdfCatastro ? "Cambiar archivo" : "Subir PDF"}
                            </label>
                            {datos.pdfCatastro && (
                                <span style={{ marginLeft: '10px', fontSize: '0.9rem', color: 'var(--texto-suave)' }}>
                                    {datos.pdfCatastro}
                                </span>
                            )}
                        </div>
                    </label>
                </div>

                {mensajeAyuda && <div className="terrenos-aviso terrenos-aviso-error">{mensajeAyuda}</div>}
            </form>
        </section>
    );
}

// Componente Principal
export default function Terrenos() {
    const contenedorRef = useRef<HTMLDivElement | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Glow efecto
    const [mouse, setMouse] = useState({ x: 50, y: 50 });

    // Sidebar
    const [menuIzquierdaAbierto, setMenuIzquierdaAbierto] = useState(false);
    const alternarMenuIzquierda = () => setMenuIzquierdaAbierto((prev) => !prev);
    const cerrarMenuIzquierda = () => setMenuIzquierdaAbierto(false);

    // Datos reales desde la API
    const [terrenos, setTerrenos] = useState<Terreno[]>([]);
    const [cargando, setCargando] = useState(true);

    const cargarTerrenos = async () => {
        try {
            setCargando(true);
            const res = await fetch("http://localhost:4000/api/terrenos");
            if (res.ok) {
                const data = await res.json();
                setTerrenos(data);
            }
        } catch (error) {
            console.error("Error al cargar terrenos:", error);
            setMensajeToast("Error al conectar con el servidor");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarTerrenos();
    }, []);

    // Navegación x URL
    const modo = (searchParams.get("modo") as ModoPagina) || "listado";
    const terrenoSeleccionadoId = searchParams.get("id");

    // Filtros
    const [busqueda, setBusqueda] = useState("");
    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
    const [mensajeToast, setMensajeToast] = useState<string>("");

    // Manejadores de teclado y mouse
    useEffect(() => {
        const manejarTecla = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                cerrarMenuIzquierda();
                setModalEliminarAbierto(false);
            }
        };
        window.addEventListener("keydown", manejarTecla);
        return () => window.removeEventListener("keydown", manejarTecla);
    }, []);

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            if (!contenedorRef.current) return;
            const rect = contenedorRef.current.getBoundingClientRect();
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

    // Toast
    useEffect(() => {
        if (!mensajeToast) return;
        const t = window.setTimeout(() => setMensajeToast(""), 2800);
        return () => window.clearTimeout(t);
    }, [mensajeToast]);

    // Memo: terreno seleccionado
    const terrenoSeleccionado = useMemo(() => {
        if (!terrenoSeleccionadoId) return null;
        return terrenos.find((t) => t.id === terrenoSeleccionadoId) ?? null;
    }, [terrenoSeleccionadoId, terrenos]);

    // Memo: filtrado
    const terrenosFiltrados = useMemo(() => {
        const texto = normalizarTexto(busqueda);
        if (!texto) return terrenos;

        return terrenos.filter((t) => {
            const bolsa = normalizarTexto(
                [
                    t.nomenclatura,
                    t.ubicacion,
                    t.localidad,
                    t.clienteId,
                    t.notas,
                ].join(" ")
            );
            return bolsa.includes(texto);
        });
    }, [busqueda, terrenos]);

    // Acciones de navegación
    const abrirCrear = () => setSearchParams({ modo: "crear" });
    const abrirVer = (id: string) => setSearchParams({ modo: "ver", id });
    const abrirEditar = (id: string) => setSearchParams({ modo: "editar", id });
    const volverAlListado = () => {
        setSearchParams({});
        setModalEliminarAbierto(false);
    };

    // Valores iniciales
    const datosInicialesCrear: FormularioTerreno = useMemo(() => ({
        nomenclatura: "",
        partida: "",
        lote: "",
        manzana: "",
        superficie: "",
        ubicacion: "",
        localidad: "",
        provincia: "",
        clienteId: "",
        notas: "",
        pdfCatastro: "",
    }), []);

    const datosInicialesEditar: FormularioTerreno = useMemo(() => {
        if (!terrenoSeleccionado) return datosInicialesCrear;
        const { id, fechaAlta, ...resto } = terrenoSeleccionado;
        return resto;
    }, [terrenoSeleccionado, datosInicialesCrear]);

    // Logica CRUD
    const guardarNuevo = (datos: FormularioTerreno) => {
        const nuevo: Terreno = {
            id: generarIdTerreno(),
            fechaAlta: obtenerHoyISO(),
            ...datos,
        };
        setTerrenos((prev) => [nuevo, ...prev]);
        setMensajeToast("Terreno creado con éxito");
        abrirVer(nuevo.id);
    };

    const guardarEdicion = (datos: FormularioTerreno) => {
        if (!terrenoSeleccionado) return;
        setTerrenos((prev) =>
            prev.map((t) => (t.id === terrenoSeleccionado.id ? { ...t, ...datos } : t))
        );
        setMensajeToast("Cambios guardados");
        abrirVer(terrenoSeleccionado.id);
    };

    const confirmarEliminar = () => {
        if (!terrenoSeleccionado) return;
        setTerrenos((prev) => prev.filter((t) => t.id !== terrenoSeleccionado.id));
        setMensajeToast("Terreno eliminado");
        setModalEliminarAbierto(false);
        volverAlListado();
    };

    return (
        <>
            <div
                ref={contenedorRef}
                className="terrenos-pagina"
                style={{ "--mx": `${mouse.x}%`, "--my": `${mouse.y}%` } as React.CSSProperties}
            >
                {/* HEADER */}
                <header className="terrenos-header">
                    <div className="terrenos-header-izquierda">
                        <button
                            className="boton-menu-unificado"
                            type="button"
                            onClick={alternarMenuIzquierda}
                            title="Menú"
                        >
                            ☰
                        </button>
                        <div>
                            <h1 className="terrenos-h1">Listado de terrenos</h1>
                            <p className="terrenos-descripcion">Administración de parcelas y ubicaciones.</p>
                        </div>
                    </div>

                    <div className="terrenos-header-derecha">
                        {modo === "listado" && (
                            <Boton variante="principal" onClick={abrirCrear}>
                                + Crear terreno
                            </Boton>
                        )}
                    </div>
                </header>

                {mensajeToast && <div className="terrenos-toast">{mensajeToast}</div>}

                {/* LISTADO */}
                {modo === "listado" && (
                    <section className="terrenos-seccion">
                        <div className="terrenos-seccion-header">
                            <div>
                                <h2 className="terrenos-h2">Terrenos registrados</h2>
                                <p className="terrenos-subtitulo">Buscá por nomenclatura, ubicación o ID de cliente.</p>
                            </div>
                            <div className="terrenos-acciones">
                                {/* Acá podríamos agregar filtros extra si hiciera falta */}
                            </div>
                        </div>

                        <div className="terrenos-barra-busqueda">
                            <input
                                className="terrenos-input terrenos-input-busqueda"
                                placeholder="Buscar... (ej: 01-05..., Río Ceballos)"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                            <div className="terrenos-contador">
                                {terrenosFiltrados.length} resultados
                            </div>
                        </div>

                        {cargando ? (
                            <div className="terrenos-vacio">
                                <div className="terrenos-vacio-titulo">Cargando terrenos...</div>
                            </div>
                        ) : terrenosFiltrados.length === 0 ? (
                            <div className="terrenos-vacio">
                                <div className="terrenos-vacio-titulo">No hay terrenos</div>
                                <div className="terrenos-vacio-sub">No coincide con la búsqueda o no cargaste ninguno.</div>
                                <Boton variante="principal" onClick={abrirCrear}>Crear primero</Boton>
                            </div>
                        ) : (
                            <div className="terrenos-tabla-contenedor">
                                <table className="terrenos-tabla">
                                    <thead>
                                        <tr>
                                            <th>Ubicación</th>
                                            <th>Nomenclatura</th>
                                            <th>Superficie</th>
                                            <th>Cliente</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {terrenosFiltrados.map((t) => (
                                            <tr key={t.id}>
                                                <td>
                                                    <div className="terrenos-celda-principal">
                                                        <div className="terrenos-avatar">T</div>
                                                        <div>
                                                            <div className="terrenos-nombre">{t.ubicacion}</div>
                                                            <div className="terrenos-sub">{t.localidad}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{t.nomenclatura}</td>
                                                <td>{t.superficie || "—"}</td>
                                                <td>{t.clienteId || "—"}</td>
                                                <td>
                                                    <div className="terrenos-acciones-tabla">
                                                        <BotonIcono titulo="Ver completo" icono="detalle" onClick={() => navigate(`/terrenos/detalle/${t.id}`)} />
                                                        <BotonIcono titulo="Ver" icono="ver" onClick={() => abrirVer(t.id)} />
                                                        <BotonIcono titulo="Editar" icono="editar" onClick={() => abrirEditar(t.id)} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}

                {/* FORMULARIOS */}
                {modo === "crear" && (
                    <FormularioTerrenos
                        modo="crear"
                        datosIniciales={datosInicialesCrear}
                        alCancelar={volverAlListado}
                        alGuardar={guardarNuevo}
                    />
                )}

                {modo === "editar" && (
                    <FormularioTerrenos
                        modo="editar"
                        datosIniciales={datosInicialesEditar}
                        alCancelar={() => (terrenoSeleccionadoId ? abrirVer(terrenoSeleccionadoId) : volverAlListado())}
                        alGuardar={guardarEdicion}
                    />
                )}

                {/* VISTA DETALLE */}
                {modo === "ver" && terrenoSeleccionado && (
                    <section className="terrenos-seccion">
                        <div className="terrenos-seccion-header">
                            <div>
                                <h2 className="terrenos-h2">Detalle del terreno</h2>
                                <p className="terrenos-subtitulo">{terrenoSeleccionado.id}</p>
                            </div>
                            <div className="terrenos-acciones">
                                <Boton variante="secundario" onClick={volverAlListado}>Volver</Boton>
                                <Boton variante="principal" onClick={() => abrirEditar(terrenoSeleccionado.id)}>Editar</Boton>
                                <Boton variante="peligro" onClick={() => setModalEliminarAbierto(true)}>Eliminar</Boton>
                            </div>
                        </div>

                        <div className="terrenos-tarjeta-detalle">
                            <div className="terrenos-detalle-header">
                                <div className="terrenos-detalle-titulo">
                                    <div className="terrenos-avatar terrenos-avatar-grande">T</div>
                                    <div>
                                        <div className="terrenos-detalle-nombre">{terrenoSeleccionado.ubicacion}</div>
                                        <div className="terrenos-sub">{terrenoSeleccionado.localidad}, {terrenoSeleccionado.provincia}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="terrenos-detalle-grid">
                                <EtiquetaDato titulo="Nomenclatura" valor={terrenoSeleccionado.nomenclatura} />
                                <EtiquetaDato titulo="Partida" valor={terrenoSeleccionado.partida} />
                                <EtiquetaDato titulo="Lote/Manzana" valor={`${terrenoSeleccionado.lote || "?"} / ${terrenoSeleccionado.manzana || "?"}`} />
                                <EtiquetaDato titulo="Superficie" valor={terrenoSeleccionado.superficie} />
                                <EtiquetaDato titulo="Alta" valor={terrenoSeleccionado.fechaAlta} />
                                <EtiquetaDato titulo="Cliente Asoc." valor={terrenoSeleccionado.clienteId} />
                                <div className="terrenos-dato">
                                    <div className="terrenos-dato-titulo">PDF Catastro</div>
                                    <div className="terrenos-dato-valor">
                                        {terrenoSeleccionado.pdfCatastro ? (
                                            <a href="#" onClick={(e) => { e.preventDefault(); alert(`Abriendo: ${terrenoSeleccionado.pdfCatastro}`); }} className="terrenos-link-pdf">
                                                📄 {terrenoSeleccionado.pdfCatastro}
                                            </a>
                                        ) : (
                                            "—"
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="terrenos-notas">
                                <div className="terrenos-notas-titulo">Notas</div>
                                <div className="terrenos-notas-texto">{terrenoSeleccionado.notas || "Sin notas adicionales."}</div>
                            </div>
                        </div>

                        <ModalConfirmacion
                            abierto={modalEliminarAbierto}
                            titulo="Eliminar terreno"
                            descripcion="¿Estás seguro? Esta acción no se puede deshacer."
                            textoCancelar="Cancelar"
                            textoConfirmar="Eliminar"
                            alCancelar={() => setModalEliminarAbierto(false)}
                            alConfirmar={confirmarEliminar}
                        />
                    </section>
                )}

                {modo === "ver" && !terrenoSeleccionado && (
                    <div className="terrenos-vacio">
                        <div className="terrenos-vacio-titulo">Terreno no encontrado</div>
                        <Boton variante="principal" onClick={volverAlListado}>Volver al listado</Boton>
                    </div>
                )}

                <BarraLateralIzquierda
                    abierto={menuIzquierdaAbierto}
                    alCerrar={cerrarMenuIzquierda}
                />
            </div>
        </>
    );
}
