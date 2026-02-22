import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import "../estilos/DetalleExpediente.css";

type ExpedientePortal = {
    id: number;
    cliente: string;
    direccion: string;
    objeto: string;
    // Nomenclatura
    depto: string; municipio: string; seccion: string; chacra: string;
    manzana: string; parcela: string; lote: string; partida_inmobiliaria: string;
    // Catastro
    presentacion_dgc: string; previa_dgc: string; definitiva_dgc: string; visado_dgc: string;
    // Municipal
    expte_muni: string; fecha_presentacion_municipalidad: string; aprobacion_muni: number;
    // Detalles anidados
    terreno_detalle?: {
        cert_catastral: string;
    };
    firmante_detalle?: {
        tipo_firmante: string;
        doc_firmante: string;
    };
    presupuesto_detalle?: {
        items: any[];
        total_a_pagar: number;
    };
};

export default function PortalCliente() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exp, setExp] = useState<ExpedientePortal | null>(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

        if (!token || usuario.rol !== 'cliente') {
            // Un cliente solo puede ver su portal, un admin/agrimensor puede verlo todo
            if (usuario.rol !== 'admin' && usuario.rol !== 'agrimensor') {
                navigate("/login");
            }
        }

        const cargarDatos = async () => {
            try {
                // Usamos un endpoint que ya existe o adaptamos uno
                const res = await apiFetch(`http://localhost:4000/api/expedientes/${id}`);
                const data = await res.json();
                setExp(data);
            } catch (error) {
                console.error("Error al cargar portal:", error);
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, [id, navigate]);

    const formatFecha = (f: string) => f ? new Date(f).toLocaleDateString() : "-";

    if (cargando) return <div style={{ textAlign: 'center', padding: '100px' }}>Cargando portal del cliente...</div>;
    if (!exp) return <div style={{ textAlign: 'center', padding: '100px' }}>No se encontró el expediente.</div>;

    return (
        <div className="detalle-exp-pagina" style={{ maxWidth: '1000px', margin: '0 auto', background: '#f8fafc' }}>

            <header className="detalle-header-grande" style={{ background: 'var(--principal)', color: 'white', borderRadius: '16px', padding: '24px' }}>
                <div className="detalle-titulo-bloque">
                    <h1 style={{ color: 'white' }}>Portal de Seguimiento</h1>
                    <div className="detalle-nro" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        Expediente #{exp.id} | {exp.objeto}
                    </div>
                </div>
                <button
                    className="expedientes-boton expedientes-boton-secundario"
                    style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white' }}
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("usuario");
                        window.location.href = "/login";
                    }}
                >
                    Cerrar Sesión
                </button>
            </header>

            <div className="detalle-grid" style={{ gridTemplateColumns: '1fr' }}>

                {/* 1. Nomenclatura Catastral */}
                <section className="tarjeta-detalle">
                    <div className="tarjeta-titulo">Nomenclatura Catastral</div>
                    <div className="datos-generales-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                        <div className="dato-resumen"><label>Depto</label><strong>{exp.depto}</strong></div>
                        <div className="dato-resumen"><label>Municipio</label><strong>{exp.municipio}</strong></div>
                        <div className="dato-resumen"><label>Sección</label><strong>{exp.seccion}</strong></div>
                        <div className="dato-resumen"><label>Chacra</label><strong>{exp.chacra}</strong></div>
                        <div className="dato-resumen"><label>Manzana</label><strong>{exp.manzana}</strong></div>
                        <div className="dato-resumen"><label>Parcela</label><strong>{exp.parcela}</strong></div>
                        <div className="dato-resumen"><label>Lote</label><strong>{exp.lote}</strong></div>
                        <div className="dato-resumen"><label>P. Inmb.</label><strong>{exp.partida_inmobiliaria}</strong></div>
                    </div>
                </section>

                {/* 2. Datos del Terreno */}
                <section className="tarjeta-detalle">
                    <div className="tarjeta-titulo">Datos del Terreno</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label className="dato-label">Ubicación del Terreno</label>
                            <div className="portal-info-valor" style={{ fontSize: '1.1rem', fontWeight: '500', marginTop: '5px' }}>
                                {exp.direccion}
                            </div>
                        </div>
                        <div>
                            <label className="dato-label">Certificado Catastral</label>
                            <div style={{ marginTop: '5px' }}>
                                <span className={`estado-badge ${exp.terreno_detalle?.cert_catastral && exp.terreno_detalle?.cert_catastral !== 'No cargado' ? 'estado-ok' : 'estado-pendiente'}`}>
                                    {exp.terreno_detalle?.cert_catastral && exp.terreno_detalle?.cert_catastral !== 'No cargado' ? "GESTIONADO" : "PENDIENTE"}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Trámite Catastro */}
                <section className="tarjeta-detalle">
                    <div className="tarjeta-titulo">Trámite Catastro</div>
                    <div className="datos-generales-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                        <div className="dato-resumen"><label>Presentación</label><strong>{formatFecha(exp.presentacion_dgc)}</strong></div>
                        <div className="dato-resumen"><label>Previa</label><strong>{formatFecha(exp.previa_dgc)}</strong></div>
                        <div className="dato-resumen"><label>Definitiva</label><strong>{formatFecha(exp.definitiva_dgc)}</strong></div>
                        <div className="dato-resumen"><label>Visado</label><strong>{formatFecha(exp.visado_dgc)}</strong></div>
                    </div>
                </section>

                {/* 4. Trámite Municipal */}
                <section className="tarjeta-detalle">
                    <div className="tarjeta-titulo">Trámite Municipal</div>
                    <div className="datos-generales-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        <div className="dato-resumen"><label>Expte Municipal</label><strong>{exp.expte_muni || "No cargado"}</strong></div>
                        <div className="dato-resumen"><label>Fecha Pres.</label><strong>{formatFecha(exp.fecha_presentacion_municipalidad)}</strong></div>
                        <div className="dato-resumen">
                            <label>Estado Municipal</label>
                            <span className={`estado-badge ${exp.aprobacion_muni ? 'estado-ok' : 'estado-pendiente'}`} style={{ display: 'block', textAlign: 'center' }}>
                                {exp.aprobacion_muni ? "APROBADO" : "EN TRÁMITE"}
                            </span>
                        </div>
                    </div>
                </section>

                {/* 5. Datos del Firmante */}
                <section className="tarjeta-detalle">
                    <div className="tarjeta-titulo">Datos del Firmante</div>
                    <div className="dato-fila" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                        <span className="dato-label">Entidad / Tipo:</span>
                        <span className="dato-valor">{exp.firmante_detalle?.tipo_firmante === "PersonaFisica" ? "Particular" : "Empresa / Sociedad"}</span>
                    </div>
                    <div className="dato-fila" style={{ marginTop: '10px' }}>
                        <span className="dato-label">Observaciones de Documentación:</span>
                    </div>
                    <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', fontSize: '0.9rem', color: '#444', lineHeight: '1.4' }}>
                        {exp.firmante_detalle?.doc_firmante || "No hay observaciones adicionales sobre la documentación."}
                    </div>
                </section>

                {/* 6. Presupuesto */}
                <section className="tarjeta-detalle">
                    <div className="tarjeta-titulo">Presupuesto</div>
                    <table className="tabla-presupuesto">
                        <thead>
                            <tr>
                                <th>Detalle del Servicio</th>
                                <th style={{ textAlign: 'right' }}>Importe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exp.presupuesto_detalle?.items?.map((item: any) => (
                                <tr key={item.id}>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{item.nombre}</div>
                                    </td>
                                    <td style={{ textAlign: 'right', fontWeight: 700 }}>$ {Number(item.total_item).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="total-fila" style={{ background: 'var(--principal)', color: 'white', padding: '15px 25px', borderRadius: '12px' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 600 }}>TOTAL A PAGAR:</span>
                        <span style={{ fontSize: '1.4rem' }}>$ {Number(exp.presupuesto_detalle?.total_a_pagar || 0).toLocaleString()}</span>
                    </div>
                </section>

            </div>

            <footer style={{ textAlign: 'center', marginTop: '40px', color: '#94a3b8', fontSize: '0.85rem', paddingBottom: '30px' }}>
                Sistema de Gestión de Agrimensura - Kiara Arguello
            </footer>
        </div>
    );
}
