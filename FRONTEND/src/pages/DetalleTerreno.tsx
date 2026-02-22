// DetalleTerreno.tsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../estilos/DetalleTerreno.css";
import BarraLateralIzquierda from "./BarraLateralIzquierda";

// Leaflet para el mapa real si hay coordenadas
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Corregir iconos de Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Tipos
type ExpedienteRelacionado = {
    id: string;
    caratula: string;
    estado: string;
    fechaInicio: string;
};

export default function DetalleTerreno() {
    const { id } = useParams();
    const navigate = useNavigate();
    const contenedorRef = useRef<HTMLDivElement | null>(null);

    // UI State
    const [mouse, setMouse] = useState({ x: 50, y: 50 });
    const [menuAbierto, setMenuAbierto] = useState(false);

    // Data State
    const [terreno, setTerreno] = useState<any | null>(null);
    const [expedientes, setExpedientes] = useState<ExpedienteRelacionado[]>([]);
    const [cargando, setCargando] = useState(true);

    // Carga de datos real
    useEffect(() => {
        const cargarDetalle = async () => {
            if (!id) return;
            try {
                setCargando(true);
                const res = await fetch(`http://localhost:4000/api/terrenos/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setTerreno(data);
                    if (data.expedientes) {
                        setExpedientes(data.expedientes);
                    }
                }
            } catch (error) {
                console.error("Error al cargar detalle del terreno:", error);
            } finally {
                setCargando(false);
            }
        };
        cargarDetalle();
    }, [id]);

    // Efecto mouse para el fondo dinámico
    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            if (!contenedorRef.current) return;
            const rect = contenedorRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setMouse({ x, y });
        };
        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, []);

    if (cargando) {
        return (
            <div className="detalle-terreno-pagina">
                <div className="detalle-header">
                    <h1 className="detalle-titulo">Cargando datos...</h1>
                </div>
            </div>
        );
    }

    if (!terreno) {
        return (
            <div className="detalle-terreno-pagina">
                <div className="detalle-header">
                    <h1 className="detalle-titulo">No se encontró el terreno</h1>
                </div>
                <div style={{ padding: '20px' }}>
                    <button className="detalle-boton detalle-boton-secundario" onClick={() => navigate("/terrenos")}>
                        Volver al listado
                    </button>
                </div>
            </div>
        );
    }

    const hasCoords = terreno.latitud && terreno.longitud;
    const position: [number, number] = hasCoords ? [Number(terreno.latitud), Number(terreno.longitud)] : [-27.367, -55.896];

    return (
        <div
            ref={contenedorRef}
            className="detalle-terreno-pagina"
            style={{ "--mx": `${mouse.x}%`, "--my": `${mouse.y}%` } as React.CSSProperties}
        >
            <header className="detalle-header">
                <div className="detalle-header-izquierda">
                    <button
                        className="boton-menu-unificado"
                        onClick={() => setMenuAbierto(!menuAbierto)}
                    >
                        ☰
                    </button>
                    <div>
                        <h1 className="detalle-titulo">Detalle de Terreno</h1>
                        <p className="detalle-subtitulo">ID Expediente: {terreno.id} — {terreno.ubicacion}</p>
                    </div>
                </div>

                <div className="detalle-acciones">
                    <button className="detalle-boton detalle-boton-secundario" onClick={() => navigate("/terrenos")}>
                        Volver
                    </button>
                    <button className="detalle-boton detalle-boton-secundario" onClick={() => navigate(`/expedientes/detalle/${terreno.id}`)}>
                        Ver Expediente
                    </button>
                </div>
            </header>

            <div className="detalle-contenido-grid">
                <div className="detalle-columna-datos">
                    {/* Sección 1: Datos del Terreno (Desde Expediente) */}
                    <section className="detalle-seccion">
                        <h2 className="detalle-seccion-titulo">Datos Técnicos (Expediente)</h2>
                        <div className="detalle-grid">
                            <EtiquetaDato titulo="Nomenclatura" valor={terreno.nomenclatura} />
                            <EtiquetaDato titulo="Partida Inmobiliaria" valor={terreno.partida} />
                            <EtiquetaDato titulo="Sección" valor={terreno.nomenclatura.split('-')[0]} />
                            <EtiquetaDato titulo="Chacra" valor={terreno.nomenclatura.split('-')[1]} />
                            <EtiquetaDato titulo="Manzana / Lote" valor={`${terreno.manzana} / ${terreno.lote}`} />
                            <EtiquetaDato titulo="Superficie" valor={terreno.superficie} />
                            <EtiquetaDato titulo="Municipio / Localidad" valor={terreno.localidad} />
                            <EtiquetaDato titulo="Departamento" valor={terreno.depto} />
                            <EtiquetaDato titulo="Titular Orig." valor={terreno.titular} />
                            <EtiquetaDato titulo="Cliente Actual" valor={terreno.clienteId} />
                            <EtiquetaDato titulo="Fecha Apertura" valor={terreno.fechaAlta} />
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <EtiquetaDato titulo="Objeto / Descripción" valor={terreno.objeto} />
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <EtiquetaDato titulo="Notas Internas" valor={terreno.notas} />
                        </div>
                    </section>

                    {/* Sección: Archivos */}
                    <section className="detalle-seccion">
                        <h2 className="detalle-seccion-titulo">Documentación Digital</h2>
                        <div className="detalle-archivos-grid">
                            <div className="detalle-archivo-item">
                                <span>PDF Catastro:</span>
                                {terreno.pdfCatastro ? (
                                    <button
                                        className="boton-archivo"
                                        onClick={() => window.open(`http://localhost:4000/uploads/${terreno.pdfCatastro}`, '_blank')}
                                    >
                                        📄 Ver Documento
                                    </button>
                                ) : " No disponible"}
                            </div>
                        </div>
                    </section>
                </div>

                <div className="detalle-columna-mapa">
                    {/* Sección 2: Ubicación Geográfica */}
                    <section className="detalle-seccion" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <h2 className="detalle-seccion-titulo">Ubicación Geográfica</h2>
                        <div className="detalle-mapa-wrapper" style={{ flex: 1, minHeight: '300px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }}>
                            <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%" }}>
                                <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={position} />
                            </MapContainer>
                        </div>
                        <div className="detalle-info-ubicacion" style={{ marginTop: '15px' }}>
                            <p><strong>Dirección:</strong> {terreno.ubicacion}</p>
                            <p><strong>Coordenadas:</strong> {hasCoords ? `${terreno.latitud}, ${terreno.longitud}` : "No georreferenciado"}</p>
                        </div>
                    </section>
                </div>
            </div>

            {/* Sección 3: Historial de Expedientes */}
            <section className="detalle-seccion">
                <h2 className="detalle-seccion-titulo">Historial de Expedientes Vinculados</h2>
                {expedientes.length === 0 ? (
                    <p>No hay expedientes vinculados a este terreno.</p>
                ) : (
                    <div className="detalle-expedientes-lista">
                        {expedientes.map((exp) => (
                            <div key={exp.id} className="detalle-expediente-item" onClick={() => navigate(`/expedientes/detalle/${exp.id}`)} style={{ cursor: 'pointer' }}>
                                <div>
                                    <div className="detalle-exp-nombre">{exp.caratula}</div>
                                    <div className="detalle-subtitulo">Número de Exp: {exp.id} — Fecha: {exp.fechaInicio}</div>
                                </div>
                                <span className={`detalle-exp-estado ${exp.estado === "Finalizado" ? "finalizado" : "tramite"}`}>
                                    {exp.estado}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <BarraLateralIzquierda
                abierto={menuAbierto}
                alCerrar={() => setMenuAbierto(false)}
            />
        </div>
    );
}

function EtiquetaDato({ titulo, valor }: { titulo: string; valor: string }) {
    return (
        <div className="detalle-dato">
            <div className="detalle-dato-titulo">{titulo}</div>
            <div className="detalle-dato-valor">{valor || "—"}</div>
        </div>
    );
}
