import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/DetalleExpediente.css";
import BarraLateralIzquierda from "./BarraLateralIzquierda";


// Leaflet
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
// Fix para el icono por defecto de Leaflet que a veces falla en builds
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

// --- Tipos Realistas ---
type ClienteBD = {
    id: string;
    nombreCompleto: string;
    dniCuil: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    localidad?: string;
    provincia?: string;
};

type TerrenoMock = { id: string; nombre: string; ubicacion: string; coords: [number, number]; superficie?: string };

const MOCK_TERRENOS: TerrenoMock[] = [
    { id: "t1", nombre: "Lote 5, Manzana A", ubicacion: "Av. Siempre Viva 123", coords: [-31.4201, -64.1888], superficie: "300 m2" },
    { id: "t2", nombre: "Finca El Descanso", ubicacion: "Camino a 60 Cuadras Km 5", coords: [-31.4651, -64.1234], superficie: "1.5 ha" },
    { id: "t3", nombre: "Calle Maipú 890", ubicacion: "Maipú 890, Córdoba", coords: [-31.4168, -64.179], superficie: "450 m2" },
];

// Coordenadas por defecto (Posadas, Misiones aprox)
const POSADAS_COORDS: [number, number] = [-27.3671, -55.8961];

// --- Componentes Helper mapa ---
function MapController({ coords }: { coords: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(coords, 16, { animate: true });
    }, [coords, map]);
    return null;
}

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function NuevoExpediente() {
    const navigate = useNavigate();
    const [menuAbierto, setMenuAbierto] = useState(false);

    // --- Estados de Modo (Existente vs Nuevo) ---
    const [modoCliente, setModoCliente] = useState<"existente" | "nuevo">("existente");
    const [modoTerreno, setModoTerreno] = useState<"existente" | "nuevo">("existente");

    // --- Cliente (Real) ---
    const [clientesBD, setClientesBD] = useState<ClienteBD[]>([]);
    const [clienteQuery, setClienteQuery] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteBD | null>(null);
    const [mostrarClientes, setMostrarClientes] = useState(false);
    const clienteRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch("http://localhost:4000/api/clientes")
            .then(res => res.json())
            .then(data => setClientesBD(data))
            .catch(err => console.error("Error al cargar clientes:", err));
    }, []);

    // Nuevo Cliente Inputs
    const [ncNombre, setNcNombre] = useState("");
    const [ncDni, setNcDni] = useState("");
    const [ncTelefono, setNcTelefono] = useState("");
    const [ncEmail, setNcEmail] = useState("");
    const [ncDireccion, setNcDireccion] = useState("");
    const [ncLocalidad, setNcLocalidad] = useState("");
    const [ncProvincia, setNcProvincia] = useState("");

    // --- Terreno ---
    const [terrenoQuery, setTerrenoQuery] = useState("");
    const [terrenoSeleccionado, setTerrenoSeleccionado] = useState<TerrenoMock | null>(null);
    const [mostrarTerrenos, setMostrarTerrenos] = useState(false);
    const terrenoRef = useRef<HTMLDivElement>(null);

    // Nuevo Terreno Inputs & Mapa
    const [ntNombre, setNtNombre] = useState("");
    const [ntDireccion, setNtDireccion] = useState("");
    const [ntSuperficie, setNtSuperficie] = useState("");
    const [ntCoords, setNtCoords] = useState<[number, number]>(POSADAS_COORDS);

    // Sugerencias de direcció (Nominatim)
    const [sugerenciasDireccion, setSugerenciasDireccion] = useState<any[]>([]);
    const [mostrarSugerenciasDir, setMostrarSugerenciasDir] = useState(false);

    // --- Nomenclatura Catastral ---
    const [depto, setDepto] = useState("");
    const [municipio, setMunicipio] = useState("");
    const [seccion, setSeccion] = useState("");
    const [chacra, setChacra] = useState("");
    const [manzana, setManzana] = useState("");
    const [parcela, setParcela] = useState("");
    const [lote, setLote] = useState("");
    const [partidaInmobiliaria, setPartidaInmobiliaria] = useState("");

    // --- Fechas y Trámites ---
    const [fechaApertura, setFechaApertura] = useState("");
    const [fechaRelevamiento, setFechaRelevamiento] = useState("");
    const [fechaPresMunicipalidad, setFechaPresMunicipalidad] = useState("");
    const [expteMuni, setExpteMuni] = useState("");
    const [aprobacionMuni, setAprobacionMuni] = useState(false);
    const [disposicionN, setDisposicionN] = useState("");
    const [informeDominial, setInformeDominial] = useState("");
    const [presentacionDgc, setPresentacionDgc] = useState("");
    const [previaDgc, setPreviaDgc] = useState("");
    const [definitivaDgc, setDefinitivaDgc] = useState("");
    const [visadoDgc, setVisadoDgc] = useState("");
    const [expedienteN, setExpedienteN] = useState("");
    const [terminado, setTerminado] = useState(false);
    const [mojones, setMojones] = useState(false);
    const [fechaMojones, setFechaMojones] = useState("");

    // --- Toggles de Omitir/Cargar ---
    const [incluirFechasEstado, setIncluirFechasEstado] = useState(false);
    const [incluirCatastro, setIncluirCatastro] = useState(false);
    const [incluirMuni, setIncluirMuni] = useState(false);

    // --- Otros ---
    const [tipoTramite, setTipoTramite] = useState("Mensura");
    const [notas, setNotas] = useState("");
    const [materiales, setMateriales] = useState("");
    const [pdfPloteo, setPdfPloteo] = useState<string>("");
    const [certCatastral, setCertCatastral] = useState<string>("");
    const [tipoFirmante, setTipoFirmante] = useState<"PersonaFisica" | "Empresa">("PersonaFisica");
    const [checklistFirmante, setChecklistFirmante] = useState<Record<string, boolean>>({
        libreDeuda: false,
        dniTitular: false,
        dniPoseedor: false,
        dniResponsable: false,
        escribano: false,
        cuilEmpresa: false
    });
    const [docFirmante, setDocFirmante] = useState("");

    const [incluirPresupuesto, setIncluirPresupuesto] = useState(true);
    const [cotizacion, setCotizacion] = useState({
        items: [] as any[],
        gastos: 0,
        sellado: 0,
        senas: 0,
        cantidadCuotas: 1,
        cuotasIguales: true,
        cuotas: [] as any[],
        tiempoEjecucion: "15 días hábiles"
    });

    // --- Acceso para el Cliente ---
    const [habilitarAcceso, setHabilitarAcceso] = useState(false);
    const [emailAcceso, setEmailAcceso] = useState("");

    const [catSeleccionada, setCatSeleccionada] = useState<number | "">("");
    const [servSeleccionado, setServSeleccionado] = useState<number | "">("");
    const [categoriasHonorarios, setCategoriasHonorarios] = useState<any[]>([]);

    useEffect(() => {
        fetch("http://localhost:4000/api/honorarios")
            .then(res => res.json())
            .then(data => {
                const ordenadas = [...data].sort((a, b) => a.tipo.localeCompare(b.tipo, undefined, { numeric: true, sensitivity: 'base' }));
                setCategoriasHonorarios(ordenadas);
            })
            .catch(err => console.error("Error cargando honorarios:", err));
    }, []);

    const serviciosVisibles = useMemo(() => {
        if (catSeleccionada === "") return [];
        return categoriasHonorarios.find(c => c.id === catSeleccionada)?.servicios.filter((s: any) => !s.esTitulo) || [];
    }, [catSeleccionada, categoriasHonorarios]);

    const agregarServicioACotizacion = () => {
        if (servSeleccionado === "") return;
        const s = serviciosVisibles.find((serv: any) => serv.id === servSeleccionado);
        if (!s) return;

        const nuevoItem = {
            id: Date.now(),
            servicioId: s.id,
            nombre: s.nombre,
            montoBase: s.montoBase,
            unidadBase: s.unidadBase,
            montoVariable: s.montoVariable,
            unidadVariable: s.unidadVariable,
            montoVariable2: s.montoVariable2 || 0,
            unidadVariable2: s.unidadVariable2 || "",
            montoPorcentaje: s.montoPorcentaje || 0,
            porcentaje: s.porcentaje || 0,
            cantidadVariable: s.montoVariable > 0 ? 1 : 0,
            cantidadVariable2: s.montoVariable2 > 0 ? 1 : 0,
            totalItem: s.montoBase + (s.montoVariable * (s.montoVariable > 0 ? 1 : 0)) + (s.montoVariable2 * (s.montoVariable2 > 0 ? 1 : 0)) + ((s.montoPorcentaje || 0) * (s.porcentaje || 0) / 100)
        };

        setCotizacion(prev => {
            const nuevoItems = [...prev.items, nuevoItem];
            return {
                ...prev,
                items: nuevoItems
            };
        });
        setServSeleccionado("");
    };

    const handleCuotaChange = (numero: number, campo: string, valor: any) => {
        setCotizacion(prev => {
            const nuevasCuotas = prev.cuotas.map((c: any) =>
                c.numero === numero ? { ...c, [campo]: valor } : c
            );
            return { ...prev, cuotas: nuevasCuotas };
        });
    };

    const regenerarCuotas = (cantidad: number, iguales: boolean) => {
        const base = totalServicios - Number(cotizacion.senas || 0);
        const montoIndividual = cantidad > 0 ? base / cantidad : 0;

        const nuevas = Array.from({ length: Math.max(0, cantidad) }, (_, i) => ({
            id: Date.now() + i,
            numero: i + 1,
            monto: iguales ? Number(montoIndividual.toFixed(2)) : 0,
            pagado: false,
            fechaPago: null
        }));

        setCotizacion(prev => ({
            ...prev,
            cantidadCuotas: cantidad,
            cuotasIguales: iguales,
            cuotas: nuevas
        }));
    };

    const actualizarItemCotizacion = (itemId: number, campo: string, valor: any) => {
        setCotizacion(prev => ({
            ...prev,
            items: prev.items.map(item => {
                if (item.id === itemId) {
                    const act = { ...item, [campo]: valor };
                    act.totalItem = Number(act.montoBase)
                        + (Number(act.montoVariable) * Number(act.cantidadVariable || 0))
                        + (Number(act.montoVariable2 || 0) * Number(act.cantidadVariable2 || 0))
                        + (Number(act.montoPorcentaje || 0) * Number(act.porcentaje || 0) / 100);
                    return act;
                }
                return item;
            })
        }));
    };

    const eliminarItemCotizacion = (itemId: number) => {
        setCotizacion(prev => ({
            ...prev,
            items: prev.items.filter(i => i.id !== itemId)
        }));
    };

    const totalServicios = useMemo(() => {
        return cotizacion.items.reduce((acc: number, curr: any) => acc + curr.totalItem, 0);
    }, [cotizacion.items]);

    const saldoPendiente = useMemo(() => {
        const total = totalServicios;
        const pagosCuotas = (cotizacion.cuotas || []).reduce((acc: number, c: any) => acc + (c.pagado ? Number(c.monto) : 0), 0);
        return total - Number(cotizacion.senas || 0) - pagosCuotas;
    }, [totalServicios, cotizacion.senas, cotizacion.cuotas]);

    // Click Outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (clienteRef.current && !clienteRef.current.contains(event.target as Node)) {
                setMostrarClientes(false);
            }
            if (terrenoRef.current && !terrenoRef.current.contains(event.target as Node)) {
                setMostrarTerrenos(false);
            }
            // Para las sugerencias de nueva dirección
            const target = event.target as HTMLElement;
            if (!target.closest(".input-direccion-container")) {
                setMostrarSugerenciasDir(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- Handlers Cliente ---
    const seleccionarCliente = (c: ClienteBD) => {
        setClienteSeleccionado(c);
        setClienteQuery(c.nombreCompleto);
        setMostrarClientes(false);
    };

    const clientesFiltrados = clientesBD.filter(c =>
        c.nombreCompleto.toLowerCase().includes(clienteQuery.toLowerCase()) ||
        c.dniCuil.includes(clienteQuery)
    );

    // --- Handlers Terreno (Existente) ---
    const seleccionarTerreno = (t: TerrenoMock) => {
        setTerrenoSeleccionado(t);
        setTerrenoQuery(t.nombre);
        setNtCoords(t.coords); // Actualizamos mapa también para ver
        setMostrarTerrenos(false);
    };

    const terrenosFiltrados = MOCK_TERRENOS.filter(t =>
        t.nombre.toLowerCase().includes(terrenoQuery.toLowerCase()) ||
        t.ubicacion.toLowerCase().includes(terrenoQuery.toLowerCase())
    );

    // --- Geocoding / Mapa (Nuevo Terreno) ---

    // 1. Buscar dirección (Forward Geocoding)
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (modoTerreno === "nuevo" && ntDireccion.length > 3 && mostrarSugerenciasDir) {
                try {
                    // Buscamos priorizando Misiones (bound box approx)
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(ntDireccion)}&viewbox=-56.5,-25.5,-53.5,-28.5&bounded=1`
                    );
                    const data = await response.json();
                    setSugerenciasDireccion(data);
                } catch (error) {
                    console.error("Error fetching address suggestions", error);
                }
            }
        }, 800);

        return () => clearTimeout(delayDebounceFn);
    }, [ntDireccion, modoTerreno, mostrarSugerenciasDir]);

    const seleccionarDireccionSugerida = (item: any) => {
        setNtDireccion(item.display_name);
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        setNtCoords([lat, lon]);
        setSugerenciasDireccion([]);
        setMostrarSugerenciasDir(false);
    };

    // 2. Click en mapa (Reverse Geocoding)
    const handleMapClick = async (lat: number, lng: number) => {
        if (modoTerreno === "existente") return; // Solo editamos en modo nuevo

        setNtCoords([lat, lng]);

        // Reverse geocoding
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            if (data && data.display_name) {
                setNtDireccion(data.display_name);
            }
        } catch (error) {
            console.error("Error reverse geocoding", error);
        }
    };

    const handleFileUpload = async (campo: "pdfPloteo" | "certCatastral", file: File | undefined) => {
        if (!file) return;

        const formData = new FormData();
        formData.append("archivo", file);

        try {
            const response = await fetch("http://localhost:4000/api/upload", {
                method: "POST",
                body: formData
            });
            const data = await response.json();
            if (data.archivo) {
                if (campo === "pdfPloteo") setPdfPloteo(data.archivo);
                if (campo === "certCatastral") setCertCatastral(data.archivo);
            } else {
                alert("Error al subir archivo: " + data.mensaje);
            }
        } catch (error) {
            console.error("Error al subir archivo:", error);
            alert("Error al conectar con el servidor de subida");
        }
    };

    const guardar = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            cliente_id: modoCliente === "existente" ? clienteSeleccionado?.id : null,
            nuevo_cliente: modoCliente === "nuevo" ? {
                nombre: ncNombre,
                dni: ncDni,
                telefono: ncTelefono,
                email: ncEmail,
                direccion: ncDireccion,
                localidad: ncLocalidad,
                provincia: ncProvincia
            } : null,
            direccion: modoTerreno === "nuevo" ? ntDireccion : terrenoSeleccionado?.ubicacion,

            // Nomenclatura
            depto, municipio, seccion, chacra, manzana, parcela, lote,
            partida_inmobiliaria: partidaInmobiliaria,

            // Trámite y Fechas (Si están omitidos, mandamos null/vacio)
            objeto: tipoTramite,
            fecha_apertura: incluirFechasEstado ? fechaApertura : null,
            fecha_relevamiento: incluirFechasEstado ? fechaRelevamiento : null,
            fecha_presentacion_municipalidad: incluirMuni ? fechaPresMunicipalidad : null,
            expte_muni: incluirMuni ? expteMuni : "No cargado",
            aprobacion_muni: incluirMuni ? aprobacionMuni : 0,
            disposicion_n: incluirMuni ? disposicionN : "No cargado",
            informe_dominial: incluirMuni ? informeDominial : "No cargado",
            presentacion_dgc: incluirCatastro ? presentacionDgc : null,
            expediente_n: incluirCatastro ? expedienteN : "No cargado",
            previa_dgc: incluirCatastro ? previaDgc : null,
            definitiva_dgc: incluirCatastro ? definitivaDgc : null,
            visado_dgc: incluirCatastro ? visadoDgc : null,
            terminado: terminado ? 1 : 0,
            mojones: mojones ? 1 : 0,
            fecha_mojones: (mojones && fechaMojones) ? fechaMojones : null,

            notas: notas,
            materiales: materiales,

            terreno_detalle: {
                designacion: modoTerreno === "nuevo" ? ntNombre : terrenoSeleccionado?.nombre,
                direccion: modoTerreno === "nuevo" ? ntDireccion : terrenoSeleccionado?.ubicacion,
                latitud: ntCoords[0],
                longitud: ntCoords[1],
                superficie: modoTerreno === "nuevo" ? ntSuperficie : terrenoSeleccionado?.superficie,
                pdf_ploteo: pdfPloteo,
                cert_catastral: certCatastral
            },
            firmante_detalle: {
                tipo_firmante: tipoFirmante,
                libre_deuda: checklistFirmante.libreDeuda,
                dni_titular: checklistFirmante.dniTitular,
                dni_poseedor: checklistFirmante.dniPoseedor,
                dni_responsable: checklistFirmante.dniResponsable,
                escribano: checklistFirmante.escribano,
                cuil_empresa: checklistFirmante.cuilEmpresa,
                doc_firmante: docFirmante
            },
            presupuesto_detalle: incluirPresupuesto ? {
                tiempo_ejecucion: cotizacion.tiempoEjecucion,
                senas: cotizacion.senas,
                cantidad_cuotas: cotizacion.cuotas.length > 0 ? cotizacion.cuotas.length : cotizacion.cantidadCuotas,
                cuotas_iguales: cotizacion.cuotasIguales,
                subtotal_servicios: totalServicios,
                total_a_pagar: totalServicios,
                items: cotizacion.items.map(i => ({
                    servicio_id: i.servicioId,
                    nombre: i.nombre,
                    monto_base: i.montoBase,
                    unidad_base: i.unidadBase,
                    monto_variable: i.montoVariable,
                    unidad_variable: i.unidadVariable,
                    cantidad_variable: i.cantidadVariable,
                    monto_variable2: i.montoVariable2,
                    unidad_variable2: i.unidadVariable2,
                    cantidad_variable2: i.cantidadVariable2,
                    monto_porcentaje: i.montoPorcentaje,
                    porcentaje: i.porcentaje,
                    total_item: i.totalItem
                })),
                cuotas: (cotizacion.cuotas || []).map(c => ({
                    numero: c.numero,
                    monto: c.monto,
                    pagado: c.pagado
                }))
            } : null,
            crear_usuario: habilitarAcceso,
            email_acceso: emailAcceso
        };

        fetch("http://localhost:4000/api/expedientes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                if (data.id) {
                    navigate("/expedientes");
                } else {
                    alert("Error al crear expediente: " + data.mensaje);
                }
            })
            .catch(err => {
                console.error("Error al crear expediente:", err);
                alert("Error de conexión al guardar.");
            });
    };

    return (
        <div className="detalle-exp-pagina">
            <BarraLateralIzquierda abierto={menuAbierto} alCerrar={() => setMenuAbierto(false)} />

            <header style={{ marginBottom: "20px" }} className="no-print">
                <button
                    className="boton-menu-unificado"
                    type="button"
                    onClick={() => setMenuAbierto(true)}
                    aria-label="Abrir menú"
                >
                    ☰
                </button>
            </header>

            <form onSubmit={guardar}>
                <div className="detalle-header-grande">
                    <div className="detalle-titulo-bloque">
                        <h1>Nuevo Expediente</h1>
                    </div>

                    <div className="acciones-detalle no-print">
                        <button type="button" className="expedientes-boton expedientes-boton-secundario" onClick={() => navigate(-1)}>
                            Cancelar
                        </button>
                        <button type="submit" className="expedientes-boton expedientes-boton-principal">
                            Crear Expediente
                        </button>
                    </div>
                </div>

                <div className="detalle-grid">
                    {/* Columna Izquierda: Inputs */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                        {/* Sección Cliente */}
                        <div className="tarjeta-detalle" style={{ overflow: "visible" }}>
                            <div className="tarjeta-titulo" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span>Cliente</span>
                                <div className="toggle-modo">
                                    <button
                                        type="button"
                                        className={`btn-toggle ${modoCliente === "existente" ? "activo" : ""}`}
                                        onClick={() => setModoCliente("existente")}
                                    >Buscar</button>
                                    <button
                                        type="button"
                                        className={`btn-toggle ${modoCliente === "nuevo" ? "activo" : ""}`}
                                        onClick={() => setModoCliente("nuevo")}
                                    >Nuevo</button>
                                </div>
                            </div>

                            {modoCliente === "existente" ? (
                                <div style={{ position: "relative" }} ref={clienteRef}>
                                    <label className="dato-label" style={{ display: "block", marginBottom: "8px" }}>Buscar Cliente</label>
                                    <input
                                        className="expedientes-input"
                                        placeholder="Escribí nombre o DNI..."
                                        value={clienteQuery}
                                        onChange={(e) => {
                                            setClienteQuery(e.target.value);
                                            setMostrarClientes(true);
                                            setClienteSeleccionado(null);
                                        }}
                                        onFocus={() => setMostrarClientes(true)}
                                    />
                                    {mostrarClientes && clienteQuery && (
                                        <ul className="lista-autocomplete">
                                            {clientesFiltrados.length > 0 ? (
                                                clientesFiltrados.map(c => (
                                                    <li key={c.id} onClick={() => seleccionarCliente(c)}>
                                                        <strong>{c.nombreCompleto}</strong> <small>({c.dniCuil})</small>
                                                    </li>
                                                ))
                                            ) : (
                                                <li style={{ color: "#999", cursor: "default" }}>No encontrado.</li>
                                            )}
                                        </ul>
                                    )}
                                    {clienteSeleccionado && (
                                        <div className="info-seleccionado">
                                            ✅ {clienteSeleccionado.nombreCompleto}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="grid-form-simple">
                                    <div>
                                        <label className="dato-label">Nombre Completo</label>
                                        <input className="expedientes-input" value={ncNombre} onChange={e => setNcNombre(e.target.value)} placeholder="Ej: Juan Pérez" />
                                    </div>
                                    <div style={{ marginTop: 12 }}>
                                        <label className="dato-label">DNI / CUIL</label>
                                        <input className="expedientes-input" value={ncDni} onChange={e => setNcDni(e.target.value)} placeholder="Ej: 20-33444555-6" />
                                    </div>
                                    <div style={{ marginTop: 12 }}>
                                        <label className="dato-label">Teléfono</label>
                                        <input className="expedientes-input" value={ncTelefono} onChange={e => setNcTelefono(e.target.value)} placeholder="Ej: 3764-112233" />
                                    </div>
                                    <div style={{ marginTop: 12 }}>
                                        <label className="dato-label">Email</label>
                                        <input className="expedientes-input" type="email" value={ncEmail} onChange={e => setNcEmail(e.target.value)} placeholder="Ej: juan@gmail.com" />
                                    </div>
                                    <div style={{ marginTop: 12 }}>
                                        <label className="dato-label">Dirección Particular</label>
                                        <input className="expedientes-input" value={ncDireccion} onChange={e => setNcDireccion(e.target.value)} placeholder="Ej: Calle 123, Posadas" />
                                    </div>
                                    <div style={{ marginTop: 12 }}>
                                        <label className="dato-label">Localidad</label>
                                        <input className="expedientes-input" value={ncLocalidad} onChange={e => setNcLocalidad(e.target.value)} placeholder="Ej: Posadas" />
                                    </div>
                                    <div style={{ marginTop: 12 }}>
                                        <label className="dato-label">Provincia</label>
                                        <input className="expedientes-input" value={ncProvincia} onChange={e => setNcProvincia(e.target.value)} placeholder="Ej: Misiones" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sección Terreno */}
                        <div className="tarjeta-detalle" style={{ overflow: "visible", zIndex: 90 }}>
                            <div className="tarjeta-titulo" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span>Terreno / Obra</span>
                                <div className="toggle-modo">
                                    <button
                                        type="button"
                                        className={`btn-toggle ${modoTerreno === "existente" ? "activo" : ""}`}
                                        onClick={() => setModoTerreno("existente")}
                                    >Buscar</button>
                                    <button
                                        type="button"
                                        className={`btn-toggle ${modoTerreno === "nuevo" ? "activo" : ""}`}
                                        onClick={() => setModoTerreno("nuevo")}
                                    >Nuevo</button>
                                </div>
                            </div>

                            {modoTerreno === "existente" ? (
                                <div style={{ position: "relative" }} ref={terrenoRef}>
                                    <label className="dato-label" style={{ display: "block", marginBottom: "8px" }}>Buscar Terreno</label>
                                    <input
                                        className="expedientes-input"
                                        placeholder="Nombre o dirección..."
                                        value={terrenoQuery}
                                        onChange={(e) => {
                                            setTerrenoQuery(e.target.value);
                                            setMostrarTerrenos(true);
                                            setTerrenoSeleccionado(null);
                                        }}
                                        onFocus={() => setMostrarTerrenos(true)}
                                    />
                                    {mostrarTerrenos && terrenoQuery && (
                                        <ul className="lista-autocomplete">
                                            {terrenosFiltrados.length > 0 ? (
                                                terrenosFiltrados.map(t => (
                                                    <li key={t.id} onClick={() => seleccionarTerreno(t)}>
                                                        <strong>{t.nombre}</strong> <br /><small>{t.ubicacion}</small>
                                                    </li>
                                                ))
                                            ) : (
                                                <li style={{ color: "#999", cursor: "default" }}>No encontrado.</li>
                                            )}
                                        </ul>
                                    )}
                                    {terrenoSeleccionado && (
                                        <div className="info-seleccionado">
                                            ✅ {terrenoSeleccionado.nombre}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="grid-form-simple">
                                    <div>
                                        <label className="dato-label">Nombre / Designación</label>
                                        <input className="expedientes-input" value={ntNombre} onChange={e => setNtNombre(e.target.value)} placeholder="Ej: Lote 14, Mz B" />
                                    </div>
                                    <div style={{ marginTop: 12 }}>
                                        <label className="dato-label">Superficie Total (m²)</label>
                                        <input className="expedientes-input" value={ntSuperficie} onChange={e => setNtSuperficie(e.target.value)} placeholder="Ej: 500.50 m2" />
                                    </div>
                                    <div style={{ marginTop: 12, position: "relative" }} className="input-direccion-container">
                                        <label className="dato-label">Dirección (Escribí para buscar en mapa)</label>
                                        <input
                                            className="expedientes-input"
                                            value={ntDireccion}
                                            onChange={e => {
                                                setNtDireccion(e.target.value);
                                                setMostrarSugerenciasDir(true);
                                            }}
                                            onFocus={() => setMostrarSugerenciasDir(true)}
                                            placeholder="Ej: Bolivar y Ayacucho, Posadas"
                                        />
                                        {mostrarSugerenciasDir && sugerenciasDireccion.length > 0 && (
                                            <ul className="lista-autocomplete">
                                                {sugerenciasDireccion.map((sug, idx) => (
                                                    <li key={idx} onClick={() => seleccionarDireccionSugerida(sug)}>
                                                        {sug.display_name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <p className="hint-text">Tip: Hacé click en el mapa para ajustar la posición.</p>
                                </div>
                            )}
                        </div>

                        {/* Sección Nomenclatura */}
                        <div className="tarjeta-detalle">
                            <div className="tarjeta-titulo">Nomenclatura Catastral</div>
                            <div className="grid-nomenclatura-crear" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                                <div>
                                    <label className="dato-label">Depto</label>
                                    <input className="expedientes-input" value={depto} onChange={e => setDepto(e.target.value)} placeholder="01" />
                                </div>
                                <div>
                                    <label className="dato-label">Municipio</label>
                                    <input className="expedientes-input" value={municipio} onChange={e => setMunicipio(e.target.value)} placeholder="54" />
                                </div>
                                <div>
                                    <label className="dato-label">Sección</label>
                                    <input className="expedientes-input" value={seccion} onChange={e => setSeccion(e.target.value)} placeholder="02" />
                                </div>
                                <div>
                                    <label className="dato-label">Chacra</label>
                                    <input className="expedientes-input" value={chacra} onChange={e => setChacra(e.target.value)} placeholder="000" />
                                </div>
                                <div>
                                    <label className="dato-label">Manzana</label>
                                    <input className="expedientes-input" value={manzana} onChange={e => setManzana(e.target.value)} placeholder="000" />
                                </div>
                                <div>
                                    <label className="dato-label">Parcela</label>
                                    <input className="expedientes-input" value={parcela} onChange={e => setParcela(e.target.value)} placeholder="000" />
                                </div>
                                <div>
                                    <label className="dato-label">Lote</label>
                                    <input className="expedientes-input" value={lote} onChange={e => setLote(e.target.value)} placeholder="A" />
                                </div>
                                <div>
                                    <label className="dato-label">P. Inmob.</label>
                                    <input className="expedientes-input" value={partidaInmobiliaria} onChange={e => setPartidaInmobiliaria(e.target.value)} placeholder="12345" />
                                </div>
                            </div>
                        </div>

                        {/* Detalles Tramite */}
                        <div className="tarjeta-detalle">
                            <div className="tarjeta-titulo">Detalles</div>
                            <div>
                                <label className="dato-label" style={{ display: "block", marginBottom: "8px" }}>Tipo</label>
                                <select className="expedientes-input" value={tipoTramite} onChange={e => setTipoTramite(e.target.value)}>
                                    <option value="Mensura">Mensura</option>
                                    <option value="Subdivision">Subdivisión</option>
                                    <option value="Unificación">Unificación</option>
                                    <option value="Amojonamiento">Amojonamiento</option>
                                </select>
                            </div>
                            <div style={{ marginTop: "16px" }}>
                                <label className="dato-label" style={{ display: "block", marginBottom: "8px" }}>PDF Ploteo</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        id="pdf-ploteo-upload"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleFileUpload("pdfPloteo", e.target.files?.[0])}
                                    />
                                    <label htmlFor="pdf-ploteo-upload" className="expedientes-boton expedientes-boton-secundario" style={{ fontSize: '0.85rem', padding: '6px 12px', cursor: 'pointer' }}>
                                        {pdfPloteo ? "Cambiar PDF" : "📁 Subir PDF Ploteo"}
                                    </label>
                                    {pdfPloteo && <span style={{ fontSize: '0.85rem', color: '#666' }}>{pdfPloteo}</span>}
                                </div>
                            </div>
                            <div style={{ marginTop: "16px" }}>
                                <label className="dato-label" style={{ display: "block", marginBottom: "8px" }}>Certificado Catastral</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        id="cert-catastral-upload"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleFileUpload("certCatastral", e.target.files?.[0])}
                                    />
                                    <label htmlFor="cert-catastral-upload" className="expedientes-boton expedientes-boton-secundario" style={{ fontSize: '0.85rem', padding: '6px 12px', cursor: 'pointer' }}>
                                        {certCatastral ? "Cambiar PDF" : "📁 Subir Certificado"}
                                    </label>
                                    {certCatastral && <span style={{ fontSize: '0.85rem', color: '#666' }}>{certCatastral}</span>}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Columna Derecha: Mapa */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div className="tarjeta-detalle" style={{ height: "100%", minHeight: "450px", padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                            <div style={{ padding: "16px 24px", borderBottom: "1px solid #eee", background: "#fdfdfd" }}>
                                <strong style={{ color: "var(--principal)" }}>Ubicación</strong>
                                {modoTerreno === "nuevo" ?
                                    <span style={{ fontSize: "0.85rem", marginLeft: 10, color: "#666" }}>(Modo Edición: Click para ubicar)</span> :
                                    <span style={{ fontSize: "0.85rem", marginLeft: 10, color: "#666" }}>(Vista Previa)</span>
                                }
                            </div>

                            <div style={{ flex: 1, position: "relative" }}>
                                <MapContainer
                                    center={POSADAS_COORDS}
                                    zoom={13}
                                    style={{ height: "100%", width: "100%" }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />

                                    {/* Controla la cámara cuando cambian las coords */}
                                    <MapController coords={modoTerreno === "existente" && terrenoSeleccionado ? terrenoSeleccionado.coords : ntCoords} />

                                    {/* Maneja clicks solo en modo nuevo */}
                                    {modoTerreno === "nuevo" && <MapClickHandler onClick={handleMapClick} />}

                                    {/* Marcador */}
                                    <Marker
                                        position={modoTerreno === "existente" && terrenoSeleccionado ? terrenoSeleccionado.coords : ntCoords}
                                    />
                                </MapContainer>
                            </div>
                        </div>


                        {/* Sección Trámites y Fechas */}
                        <div className="tarjeta-detalle">
                            <div className="tarjeta-titulo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Fechas y Estado</span>
                                <div className="toggle-modo">
                                    <button
                                        type="button"
                                        className={`btn-toggle ${!incluirFechasEstado ? "activo" : ""}`}
                                        onClick={() => setIncluirFechasEstado(false)}
                                    >Omitir</button>
                                    <button
                                        type="button"
                                        className={`btn-toggle ${incluirFechasEstado ? "activo" : ""}`}
                                        onClick={() => setIncluirFechasEstado(true)}
                                    >Cargar</button>
                                </div>
                            </div>
                            {incluirFechasEstado && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                                    <div>
                                        <label className="dato-label">Fecha Apertura</label>
                                        <input type="date" className="expedientes-input" value={fechaApertura} onChange={e => setFechaApertura(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="dato-label">Fecha Relevamiento</label>
                                        <input type="date" className="expedientes-input" value={fechaRelevamiento} onChange={e => setFechaRelevamiento(e.target.value)} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600 }}>
                                            <input type="checkbox" checked={terminado} onChange={e => setTerminado(e.target.checked)} />
                                            Marcar como FINALIZADO
                                        </label>

                                        <div style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600 }}>
                                                <input type="checkbox" checked={mojones} onChange={e => setMojones(e.target.checked)} />
                                                Colocación de Mojones
                                            </label>
                                            {mojones && (
                                                <div style={{ marginTop: '10px', paddingLeft: '25px' }}>
                                                    <label className="dato-label" style={{ fontSize: '0.8rem' }}>Fecha de Mojones</label>
                                                    <input type="date" className="expedientes-input" value={fechaMojones} onChange={e => setFechaMojones(e.target.value)} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>


                        {/* Sección Catastro (DGC) */}
                        <div className="tarjeta-detalle">
                            <div className="tarjeta-titulo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Catastro (DGC)</span>
                                <div className="toggle-modo">
                                    <button
                                        type="button"
                                        className={`btn-toggle ${!incluirCatastro ? "activo" : ""}`}
                                        onClick={() => setIncluirCatastro(false)}
                                    >Omitir</button>
                                    <button
                                        type="button"
                                        className={`btn-toggle ${incluirCatastro ? "activo" : ""}`}
                                        onClick={() => setIncluirCatastro(true)}
                                    >Cargar</button>
                                </div>
                            </div>
                            {incluirCatastro && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '15px' }}>
                                    <div>
                                        <label className="dato-label">Presentación DGC</label>
                                        <input type="date" className="expedientes-input" value={presentacionDgc} onChange={e => setPresentacionDgc(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="dato-label">Previa DGC</label>
                                        <input type="date" className="expedientes-input" value={previaDgc} onChange={e => setPreviaDgc(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="dato-label">Definitiva DGC</label>
                                        <input type="date" className="expedientes-input" value={definitivaDgc} onChange={e => setDefinitivaDgc(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="dato-label">Visado DGC</label>
                                        <input type="date" className="expedientes-input" value={visadoDgc} onChange={e => setVisadoDgc(e.target.value)} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label className="dato-label">Nº expte</label>
                                        <input className="expedientes-input" value={expedienteN} onChange={e => setExpedienteN(e.target.value)} placeholder="Ej: 15-M-2024" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sección Municipal y Otros */}
                        <div className="tarjeta-detalle">
                            <div className="tarjeta-titulo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Municipalidad / Otros</span>
                                <div className="toggle-modo">
                                    <button
                                        type="button"
                                        className={`btn-toggle ${!incluirMuni ? "activo" : ""}`}
                                        onClick={() => setIncluirMuni(false)}
                                    >Omitir</button>
                                    <button
                                        type="button"
                                        className={`btn-toggle ${incluirMuni ? "activo" : ""}`}
                                        onClick={() => setIncluirMuni(true)}
                                    >Cargar</button>
                                </div>
                            </div>
                            {incluirMuni && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '15px' }}>
                                    <div>
                                        <label className="dato-label">Expte Municipal</label>
                                        <input className="expedientes-input" value={expteMuni} onChange={e => setExpteMuni(e.target.value)} placeholder="N° 1234/23" />
                                    </div>
                                    <div>
                                        <label className="dato-label">Fecha Pres. Muni</label>
                                        <input type="date" className="expedientes-input" value={fechaPresMunicipalidad} onChange={e => setFechaPresMunicipalidad(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="dato-label">Disposición N°</label>
                                        <input className="expedientes-input" value={disposicionN} onChange={e => setDisposicionN(e.target.value)} placeholder="Disp. 45/24" />
                                    </div>
                                    <div>
                                        <label className="dato-label">Informe Dominial</label>
                                        <input className="expedientes-input" value={informeDominial} onChange={e => setInformeDominial(e.target.value)} placeholder="Estado..." />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                            <input type="checkbox" checked={aprobacionMuni} onChange={e => setAprobacionMuni(e.target.checked)} />
                                            Aprobación Municipal
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- SECCIÓN 4: PRESUPUESTO (NUEVO) --- */}
                <div className="tarjeta-detalle" style={{ marginTop: '24px' }}>
                    <div className="tarjeta-titulo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>4. Presupuesto Inicial (Opcional)</span>
                        <div className="toggle-modo">
                            <button
                                type="button"
                                className={`btn-toggle ${!incluirPresupuesto ? "activo" : ""}`}
                                onClick={() => setIncluirPresupuesto(false)}
                            >Omitir</button>
                            <button
                                type="button"
                                className={`btn-toggle ${incluirPresupuesto ? "activo" : ""}`}
                                onClick={() => setIncluirPresupuesto(true)}
                            >Cargar</button>
                        </div>
                    </div>

                    {incluirPresupuesto && (
                        <div className="presupuesto-nuevo-expediente">
                            <div className="selector-servicio-presupuesto" style={{ marginTop: '15px' }}>
                                <div className="input-grupo">
                                    <label>Categoría</label>
                                    <select value={catSeleccionada} onChange={e => { setCatSeleccionada(Number(e.target.value)); setServSeleccionado(""); }}>
                                        <option value="">Seleccionar Categoría...</option>
                                        {categoriasHonorarios.map(c => <option key={c.id} value={c.id}>{c.tipo}</option>)}
                                    </select>
                                </div>
                                <div className="input-grupo">
                                    <label>Servicio</label>
                                    <select value={servSeleccionado} onChange={e => setServSeleccionado(Number(e.target.value))} disabled={!catSeleccionada}>
                                        <option value="">Seleccionar Servicio...</option>
                                        {serviciosVisibles.map((s: any) => <option key={s.id} value={s.id}>{s.codigo} - {s.nombre}</option>)}
                                    </select>
                                </div>
                                <button type="button" className="expedientes-boton-principal" onClick={agregarServicioACotizacion} disabled={!servSeleccionado} style={{ alignSelf: 'flex-end', height: '40px' }}>
                                    + Agregar
                                </button>
                            </div>

                            <table className="tabla-presupuesto">
                                <thead>
                                    <tr>
                                        <th>Item / Servicio</th>
                                        <th>Monto Base</th>
                                        <th>Adicional</th>
                                        {cotizacion.items.some(i => i.montoPorcentaje > 0 || i.porcentaje > 0) && <th>Porcentaje</th>}
                                        <th>Total Item</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cotizacion.items.map(item => (
                                        <tr key={item.id}>
                                            <td>
                                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.nombre}</div>
                                                <small style={{ color: '#888' }}>{item.unidadBase}</small>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <span>$</span>
                                                    <input type="number" className="input-presupuesto" style={{ width: '100px' }} value={item.montoBase} onChange={e => actualizarItemCotizacion(item.id, "montoBase", Number(e.target.value))} />
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    {item.montoVariable > 0 && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <div className="contador-variable">
                                                                <button type="button" className="btn-counter" onClick={() => actualizarItemCotizacion(item.id, "cantidadVariable", Math.max(0, item.cantidadVariable - 1))}>-</button>
                                                                <input type="number" className="input-presupuesto input-chico" value={item.cantidadVariable} onChange={e => actualizarItemCotizacion(item.id, "cantidadVariable", Number(e.target.value))} />
                                                                <button type="button" className="btn-counter" onClick={() => actualizarItemCotizacion(item.id, "cantidadVariable", item.cantidadVariable + 1)}>+</button>
                                                            </div>
                                                            <small style={{ fontSize: '0.75rem', color: '#666' }}>{item.unidadVariable}</small>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderLeft: '1px solid #ddd', paddingLeft: '8px' }}>
                                                                <span style={{ fontSize: '0.7rem', color: '#888' }}>$</span>
                                                                <input type="number" className="input-presupuesto input-chico" style={{ width: '80px' }} value={item.montoVariable} onChange={e => actualizarItemCotizacion(item.id, "montoVariable", Number(e.target.value))} />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {item.montoVariable2 > 0 && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <div className="contador-variable">
                                                                <button type="button" className="btn-counter" onClick={() => actualizarItemCotizacion(item.id, "cantidadVariable2", Math.max(0, item.cantidadVariable2 - 1))}>-</button>
                                                                <input type="number" className="input-presupuesto input-chico" value={item.cantidadVariable2} onChange={e => actualizarItemCotizacion(item.id, "cantidadVariable2", Number(e.target.value))} />
                                                                <button type="button" className="btn-counter" onClick={() => actualizarItemCotizacion(item.id, "cantidadVariable2", item.cantidadVariable2 + 1)}>+</button>
                                                            </div>
                                                            <small style={{ fontSize: '0.75rem', color: '#666' }}>{item.unidadVariable2}</small>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderLeft: '1px solid #ddd', paddingLeft: '8px' }}>
                                                                <span style={{ fontSize: '0.7rem', color: '#888' }}>$</span>
                                                                <input type="number" className="input-presupuesto input-chico" style={{ width: '80px' }} value={item.montoVariable2} onChange={e => actualizarItemCotizacion(item.id, "montoVariable2", Number(e.target.value))} />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {item.montoVariable <= 0 && item.montoVariable2 <= 0 && "-"}
                                                </div>
                                            </td>
                                            {cotizacion.items.some(i => i.montoPorcentaje > 0 || i.porcentaje > 0) && (
                                                <td>
                                                    {(item.montoPorcentaje > 0 || item.porcentaje > 0) ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <span style={{ fontSize: '0.75rem' }}>Valor $</span>
                                                                <input type="number" className="input-presupuesto input-chico" style={{ width: '80px' }} value={item.montoPorcentaje} onChange={e => actualizarItemCotizacion(item.id, "montoPorcentaje", Number(e.target.value))} />
                                                                <button
                                                                    type="button"
                                                                    className="btn-counter"
                                                                    style={{ background: '#f8d7da', color: '#721c24', fontSize: '0.6rem', padding: '2px 5px' }}
                                                                    onClick={() => {
                                                                        actualizarItemCotizacion(item.id, "montoPorcentaje", 0);
                                                                        actualizarItemCotizacion(item.id, "porcentaje", 0);
                                                                    }}
                                                                    title="Quitar porcentaje"
                                                                >✕</button>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <span style={{ fontSize: '0.75rem' }}>%</span>
                                                                <input type="number" className="input-presupuesto input-chico" style={{ width: '50px' }} value={item.porcentaje} onChange={e => actualizarItemCotizacion(item.id, "porcentaje", Number(e.target.value))} />
                                                                <span style={{ fontSize: '0.7rem', color: '#666' }}>({((item.montoPorcentaje * item.porcentaje) / 100).toLocaleString()})</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="btn-counter"
                                                            onClick={() => actualizarItemCotizacion(item.id, "porcentaje", 1)}
                                                            title="Habilitar porcentaje"
                                                            style={{ width: 'auto', padding: '2px 8px', fontSize: '0.75rem' }}
                                                        >
                                                            + %
                                                        </button>
                                                    )}
                                                </td>
                                            )}
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '0.8rem', color: '#888' }}>
                                                    $ {item.montoBase.toLocaleString()}
                                                    {item.montoVariable > 0 && item.cantidadVariable > 0 && ` + $ ${(item.montoVariable * item.cantidadVariable).toLocaleString()}`}
                                                    {item.montoVariable2 > 0 && item.cantidadVariable2 > 0 && ` + $ ${(item.montoVariable2 * item.cantidadVariable2).toLocaleString()}`}
                                                    {item.montoPorcentaje > 0 && item.porcentaje > 0 && ` + $ ${((item.montoPorcentaje * item.porcentaje) / 100).toLocaleString()}`}
                                                </div>
                                                <div style={{ fontWeight: 700, color: 'var(--principal)', fontSize: '1.1rem' }}>
                                                    $ {item.totalItem.toLocaleString()}
                                                </div>
                                            </td>
                                            <td>
                                                <button type="button" className="btn-mini btn-borrar" onClick={() => eliminarItemCotizacion(item.id)}>✕</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="resumen-presupuesto-grid">
                                <div className="presupuesto-col-izq">
                                    <div className="cuotas-seccion-bloque" style={{ marginTop: '20px', padding: '15px', background: '#f0f4f8', borderRadius: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <strong style={{ color: 'var(--principal)' }}>Plan de Cuotas</strong>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <input type="number" style={{ width: '50px' }} value={cotizacion.cantidadCuotas} onChange={e => regenerarCuotas(Number(e.target.value), cotizacion.cuotasIguales)} />
                                                <label style={{ fontSize: '0.8rem', cursor: 'pointer', display: 'flex', gap: '4px' }}>
                                                    <input type="checkbox" checked={cotizacion.cuotasIguales} onChange={e => regenerarCuotas(cotizacion.cantidadCuotas, e.target.checked)} />
                                                    Iguales
                                                </label>
                                            </div>
                                        </div>

                                        <div className="cuotas-lista-scroll" style={{ maxHeight: '150px', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
                                            {(cotizacion.cuotas || []).map((c: any) => (
                                                <div key={c.numero} style={{ background: 'white', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.85rem' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span>Cuota {c.numero}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                                                        <input type="number" style={{ width: '100%' }} value={c.monto} onChange={e => handleCuotaChange(c.numero, "monto", Number(e.target.value))} disabled={cotizacion.cuotasIguales} />
                                                        <label style={{ fontSize: '0.7rem', display: 'flex', gap: '3px' }}>
                                                            <input type="checkbox" checked={c.pagado} onChange={e => handleCuotaChange(c.numero, "pagado", e.target.checked)} />
                                                            Cargar como pagada
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="presupuesto-col-der">
                                    <div className="fila-resumen">
                                        <span>Total Honorarios</span>
                                        <strong>$ {totalServicios.toLocaleString()}</strong>
                                    </div>
                                    <div className="fila-resumen sena-fila">
                                        <span>Seña Recibida</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <span>- $</span>
                                            <input type="number" className="input-presupuesto" style={{ width: '100px', border: 'none', background: '#f5f5f5', textAlign: 'right' }} value={cotizacion.senas} onChange={e => setCotizacion(prev => ({ ...prev, senas: Number(e.target.value) }))} />
                                        </div>
                                    </div>
                                    <div className="total-fila" style={{ marginTop: '15px', paddingTop: '15px', borderTop: '2px dashed #ddd', background: 'var(--principal)', color: 'white' }}>
                                        <span>SALDO A PAGAR:</span>
                                        <span style={{ fontSize: '1.4rem' }}>$ {saldoPendiente.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="detalle-grid" style={{ marginTop: '24px', gridTemplateColumns: '1fr 1fr' }}>
                    <div className="tarjeta-detalle" style={{ height: 'fit-content' }}>
                        <div className="tarjeta-titulo">Materiales del Terreno</div>
                        <textarea
                            className="expedientes-input"
                            placeholder="Lista de materiales (estacas, mojones, etc.)..."
                            value={materiales}
                            onChange={e => setMateriales(e.target.value)}
                            style={{ width: '100%', minHeight: '100px', resize: 'none', overflow: 'hidden' }}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = target.scrollHeight + 'px';
                            }}
                        />
                    </div>
                    <div className="tarjeta-detalle" style={{ height: 'fit-content' }}>
                        <div className="tarjeta-titulo">Notas del Expediente</div>
                        <textarea
                            className="expedientes-input"
                            placeholder="Observaciones para el agrimensor..."
                            value={notas}
                            onChange={e => setNotas(e.target.value)}
                            style={{ width: '100%', minHeight: '100px', resize: 'none', overflow: 'hidden' }}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = target.scrollHeight + 'px';
                            }}
                        />
                    </div>
                </div>

                <div className="tarjeta-detalle" style={{ marginTop: '24px' }}>
                    <div className="tarjeta-titulo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Datos del Firmante</span>
                        <div className="toggle-modo">
                            <button type="button" className={`btn-toggle ${tipoFirmante === "PersonaFisica" ? "activo" : ""}`} onClick={() => setTipoFirmante("PersonaFisica")}>Individual</button>
                            <button type="button" className={`btn-toggle ${tipoFirmante === "Empresa" ? "activo" : ""}`} onClick={() => setTipoFirmante("Empresa")}>Empresa</button>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.2fr) 1.5fr', gap: '24px' }}>
                        <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '12px', fontSize: '0.9rem' }}>
                            <strong style={{ display: 'block', marginBottom: '15px', color: 'var(--principal)' }}>Checklist de Documentación:</strong>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {tipoFirmante === "Empresa" && (
                                    <>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold', color: '#d32f2f' }}>
                                            <input type="checkbox" checked={checklistFirmante.escribano} onChange={e => setChecklistFirmante({ ...checklistFirmante, escribano: e.target.checked })} />
                                            Presentación ante Escribano
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                            <input type="checkbox" checked={checklistFirmante.cuilEmpresa} onChange={e => setChecklistFirmante({ ...checklistFirmante, cuilEmpresa: e.target.checked })} />
                                            CUIL Empresa
                                        </label>
                                    </>
                                )}
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={checklistFirmante.libreDeuda} onChange={e => setChecklistFirmante({ ...checklistFirmante, libreDeuda: e.target.checked })} />
                                    Libre de Deuda
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={checklistFirmante.dniTitular} onChange={e => setChecklistFirmante({ ...checklistFirmante, dniTitular: e.target.checked })} />
                                    Fotocopia DNI Titular
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={checklistFirmante.dniPoseedor} onChange={e => setChecklistFirmante({ ...checklistFirmante, dniPoseedor: e.target.checked })} />
                                    Fotocopia DNI Poseedor
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={checklistFirmante.dniResponsable} onChange={e => setChecklistFirmante({ ...checklistFirmante, dniResponsable: e.target.checked })} />
                                    Fotocopia DNI Responsable
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="dato-label" style={{ display: "block", marginBottom: "8px" }}>Observaciones de Documentación</label>
                            <textarea
                                className="expedientes-input"
                                placeholder="Indicar qué documentación se presentó o falta..."
                                value={docFirmante}
                                onChange={e => setDocFirmante(e.target.value)}
                                style={{ width: '100%', minHeight: '100px', resize: 'vertical' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Sección Acceso Externo */}
                <div className="tarjeta-detalle" style={{ marginTop: '24px' }}>
                    <div className="tarjeta-titulo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Acceso para el Cliente (Seguimiento Online)</span>
                        <div className="toggle-modo">
                            <button
                                type="button"
                                className={`btn-toggle ${!habilitarAcceso ? "activo" : ""}`}
                                onClick={() => setHabilitarAcceso(false)}
                            >No</button>
                            <button
                                type="button"
                                className={`btn-toggle ${habilitarAcceso ? "activo" : ""}`}
                                onClick={() => setHabilitarAcceso(true)}
                            >Sí, crear acceso</button>
                        </div>
                    </div>

                    {habilitarAcceso && (
                        <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label className="dato-label">Correo Electrónico del Cliente</label>
                                <input
                                    className="expedientes-input"
                                    type="email"
                                    placeholder="ejemplo@correo.com"
                                    value={emailAcceso}
                                    onChange={e => setEmailAcceso(e.target.value)}
                                />
                                <p className="hint-text">Se enviará una invitación a este correo para que el cliente genere sus credenciales.</p>
                            </div>
                            <div style={{ gridColumn: 'span 2', padding: '10px', background: 'rgba(var(--principal-rgb), 0.05)', borderRadius: '8px', border: '1px solid rgba(var(--principal-rgb), 0.1)' }}>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#555' }}>
                                    <strong>Nota:</strong> Al habilitar esta opción, el cliente podrá ver el progreso de su expediente, descargar el presupuesto y ver las facturas pendientes.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

            </form>

            <style>{`
         .toggle-modo {
           display: flex;
           background: #eee;
           border-radius: 8px;
           padding: 2px;
         }
         .btn-toggle {
           border: none;
           background: transparent;
           padding: 4px 12px;
           border-radius: 6px;
           cursor: pointer;
           font-size: 0.85rem;
           font-weight: 500;
           color: #666;
         }
         .btn-toggle.activo {
           background: white;
           color: var(--principal);
           box-shadow: 0 2px 4px rgba(0,0,0,0.05);
           font-weight: 700;
         }
         .info-seleccionado {
           margin-top: 10px;
           padding: 8px 12px;
           background: #e8f5e9;
           color: #2e7d32;
           border-radius: 8px;
           font-weight: 600;
           font-size: 0.9rem;
         }
         .hint-text {
           font-size: 0.8rem;
           color: #888;
           margin-top: 8px;
         }
         /* Ajustes Leaflet z-index para no tapar dropdowns */
         .leaflet-container {
           z-index: 10;
           cursor: pointer !important; /* Indica que se puede seleccionar (click) */
         }
         /* Sobreescribir el cursor de 'grab' (mano abierta) de Leaflet */
         .leaflet-grab {
            cursor: pointer !important;
         }
         /* Manito cerrada solo al mantener apretado (dragging) */
         .leaflet-dragging .leaflet-grab,
         .leaflet-grab:active {
            cursor: grabbing !important;
         }
          .boton-volver-minimalista {
            background: transparent;
            border: none;
            color: #666;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 8px 12px;
            border-radius: 8px;
            transition: all 0.2s;
            margin-left: 10px;
          }
          .boton-volver-minimalista:hover {
            background: #f0f0f0;
            color: var(--principal);
          }
       `}</style>
        </div>
    );
}
