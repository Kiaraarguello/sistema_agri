import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../estilos/DetalleExpediente.css";
import BarraLateralIzquierda from "./BarraLateralIzquierda";

// Leaflet Imports
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
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

// Helper para capturar clicks en el mapa (modo edición)
function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e: L.LeafletMouseEvent) {
            onClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "-";
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return "-";
        return d.toISOString().split('T')[0];
    } catch (e) {
        return "-";
    }
};


export default function DetalleExpediente() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [cargando, setCargando] = useState(true);

    // --- Estado Principal ---
    const [expediente, setExpediente] = useState<any>({
        // ... (keep structure identical)
        id: id,
        numero: "-",
        cliente: "-",
        dni: "-",
        terreno: "-",
        ubicacion: "-",
        coords: [-27.367, -55.896] as [number, number],
        estado: "-",
        avance: "0%",
        etapa: "-",
        fechas: { creado: "-", relevamiento: "-", inicio_catastro: "-", visado: "-", finalizado: "-", presentacion_muni: "-", presentacion_dgc: "-", previa_dgc: "-", definitiva_dgc: "-" },
        notas: "-",
        materiales: "-",
        pdf_catastro: "-",
        pdf_ploteo: "-",
        cert_catastral: "-",
        tipo_firmante: "PersonaFisica",
        checklist_firmante: {
            libre_deuda: false,
            dni_titular: false,
            dni_poseedor: false,
            dni_responsable: false,
            escribano: false,
            cuil_empresa: false
        },
        doc_firmante: "-",
        cliente_id: null,
        cliente_activo: true,
        historial: [],
        notas_relevamiento: "",
        mojones: false,
        fecha_mojones: null,
        cotizacion: { items: [], senas: 0, tiempoEjecucion: "-", requisitos: "-", subtotal: 0, total: 0, cuotas: [], cantidadCuotas: 1, cuotasIguales: true }
    });

    // --- Estado Edición Global ---
    const [modoEdicion, setModoEdicion] = useState(false);
    const [datosEditSeccion, setDatosEditSeccion] = useState<any>(null);

    // --- Estado para el Modal de Presupuesto Personalizado ---
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [budgetDataOverriden, setBudgetDataOverriden] = useState<any>({
        nombre_cliente: "",
        objeto: "",
        depto: "",
        municipio: "",
        seccion: "",
        chacra: "",
        manzana: "",
        parcela: "",
        total_honorarios: "",
        tiempo_ejecucion: "",
        requisitos: "",
    });

    const [showFichaModal, setShowFichaModal] = useState(false);
    const [ultimoPresupuesto, setUltimoPresupuesto] = useState<{ existe: boolean, fecha?: string, filename?: string } | null>(null);
    const [ultimaPeticionCatastro, setUltimaPeticionCatastro] = useState<{ existe: boolean, fecha?: string, filename?: string } | null>(null);

    const verificarUltimoPresupuesto = async () => {
        try {
            const res = await fetch(`http://localhost:4000/api/expedientes/${id}/ultimo-presupuesto`);
            const data = await res.json();
            setUltimoPresupuesto(data);
        } catch (e) {
            console.error("Error verificando último presupuesto:", e);
        }
    };

    const verificarUltimaPeticionCatastro = async () => {
        try {
            const res = await fetch(`http://localhost:4000/api/expedientes/${id}/ultima-peticion-catastro`);
            const data = await res.json();
            setUltimaPeticionCatastro(data);
        } catch (e) {
            console.error("Error verificando última petición catastro:", e);
        }
    };

    // Verificar al cargar
    useEffect(() => {
        verificarUltimoPresupuesto();
        verificarUltimaPeticionCatastro();
    }, [id]);

    const abrirModalPresupuesto = () => {
        setBudgetDataOverriden({
            nombre_cliente: expediente.cliente !== "Sin cliente" ? expediente.cliente : (expediente.titular !== "S/D" ? expediente.titular : ""),
            objeto: expediente.objeto || "",
            depto: expediente.depto || "",
            municipio: expediente.municipio || "",
            seccion: expediente.seccion || "",
            chacra: expediente.chacra || "",
            manzana: expediente.manzana || "",
            parcela: expediente.parcela || "",
            total_honorarios: expediente.cotizacion.total.toLocaleString('es-AR', { minimumFractionDigits: 2 }),
            tiempo_ejecucion: expediente.cotizacion.tiempoEjecucion ? expediente.cotizacion.tiempoEjecucion.replace(/\D/g, '') : "30",
            requisitos: expediente.cotizacion.requisitos || "",
            cuotas_resumen: expediente.cotizacion.cuotas.map((c: any) => `Cuota ${c.numero}: $${Number(c.monto).toLocaleString('es-AR')}${c.pagado ? ' (Pagada)' : ''}`).join('\n')
        });
        setShowBudgetModal(true);
    };

    const descargarPresupuestoPersonalizado = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/expedientes/${id}/presupuesto-docx`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(budgetDataOverriden)
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `presupuesto_${id}.docx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            setShowBudgetModal(false);
            // Actualizar estado del botón de descarga
            setTimeout(verificarUltimoPresupuesto, 1000);
        } catch (error) {
            console.error("Error al descargar:", error);
            alert("No se pudo generar el documento.");
        }
    };

    const generarPeticionCatastro = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/expedientes/${id}/peticion-catastro-docx`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre_cliente: expediente.cliente !== "Sin cliente" ? expediente.cliente : (expediente.titular !== "S/D" ? expediente.titular : ""),
                    objeto: expediente.objeto || "",
                    depto: expediente.depto || "",
                    municipio: expediente.municipio || "",
                    seccion: expediente.seccion || "",
                    chacra: expediente.chacra || "",
                    manzana: expediente.manzana || "",
                    parcela: expediente.parcela || "",
                    lote: expediente.lote || "",
                    partida_inmobiliaria: expediente.partida_inmobiliaria || "",
                    expediente_n: expediente.expediente_n || "",
                    titular: expediente.titular || "",
                    cliente_dni: expediente.cliente_dni || "",
                    cliente_direccion: expediente.cliente_direccion || ""
                })
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `peticion_catastro_${id}.docx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            // Actualizar estado del botón de descarga
            setTimeout(verificarUltimaPeticionCatastro, 1000);
        } catch (error) {
            console.error("Error al generar petición catastro:", error);
            alert("No se pudo generar la petición de catastro.");
        }
    };

    const descargarFichaPDF = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/expedientes/${id}/ficha-pdf`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ficha_${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al descargar ficha:", error);
            alert("No se pudo generar el archivo PDF.");
        }
    };

    // Cargar datos reales
    const cargarExpediente = () => {
        fetch(`http://localhost:4000/api/expedientes/${id}`)
            .then(res => res.json())
            .then(data => {
                const terr = data.terreno_detalle || {};
                const firm = data.firmante_detalle || {};
                const pres = data.presupuesto_detalle || { items: [] };

                setExpediente({
                    ...data,
                    numero: data.id.toString(),
                    cliente: data.cliente_nombre || "Sin cliente",
                    cliente_dni: data.cliente_dni || "S/D",
                    cliente_telefono: data.cliente_telefono || "Sin teléfono",
                    cliente_email: data.cliente_email || "S/D",
                    cliente_direccion: data.cliente_direccion || "Sin dirección",
                    cliente_localidad: data.cliente_localidad || "S/D",
                    cliente_provincia: data.cliente_provincia || "S/D",
                    cliente_id: data.cliente_id,
                    cliente_activo: data.cliente_activo,
                    titular: data.titular || "S/D",
                    terreno: terr.designacion || data.direccion || data.objeto || "S/D",
                    ubicacion: terr.direccion || data.direccion || "Sin dirección",
                    coords: [Number(terr.latitud) || -27.367, Number(terr.longitud) || -55.896] as [number, number],
                    estado: data.terminado ? "Finalizado" : "En Proceso",
                    etapa: data.visado_dgc ? "Visado" : "Catastro",
                    avance: data.terminado ? "100%" : "50%",
                    tiene_usuario: data.tiene_usuario > 0,
                    // Asegurar nomenclatura en root
                    depto: data.depto || terr.depto || "",
                    municipio: data.municipio || terr.municipio || "",
                    seccion: data.seccion || terr.seccion || "",
                    chacra: data.chacra || terr.chacra || "",
                    manzana: data.manzana || terr.manzana || "",
                    parcela: data.parcela || terr.parcela || "",
                    lote: data.lote || terr.lote || "",
                    partida_inmobiliaria: data.partida_inmobiliaria || terr.partida_inmobiliaria || "",
                    expediente_n: data.expediente_n || "",
                    objeto: data.objeto || "",
                    responsable: data.responsable || "",

                    fechas: {
                        creado: data.fecha_apertura ? formatDate(data.fecha_apertura) : "S/D",
                        relevamiento: formatDate(data.fecha_relevamiento),
                        inicio_catastro: data.certificado_catastral || "-",
                        presentacion_muni: formatDate(data.fecha_presentacion_municipalidad),
                        presentacion_dgc: formatDate(data.presentacion_dgc),
                        previa_dgc: formatDate(data.previa_dgc),
                        definitiva_dgc: formatDate(data.definitiva_dgc),
                        visado: formatDate(data.visado_dgc),
                        finalizado: formatDate(data.definitiva_dgc)
                    },
                    notas: data.notas || "Sin notas adicionales.",
                    materiales: data.materiales || "Sin materiales registrados.",
                    pdf_catastro: (terr.pdf_catastro && terr.pdf_catastro !== "No cargado") ? terr.pdf_catastro : (data.pdf_catastro_file && data.pdf_catastro_file !== "No cargado") ? data.pdf_catastro_file : null,
                    pdf_ploteo: (terr.pdf_ploteo && terr.pdf_ploteo !== "No cargado") ? terr.pdf_ploteo : null,
                    cert_catastral: (terr.cert_catastral && terr.cert_catastral !== "No cargado") ? terr.cert_catastral : (data.cert_catastral_file && data.cert_catastral_file !== "No cargado") ? data.cert_catastral_file : null,
                    tipo_firmante: firm.tipo_firmante || "PersonaFisica",
                    checklist_firmante: {
                        libre_deuda: !!firm.libre_deuda,
                        dni_titular: !!firm.dni_titular,
                        dni_poseedor: !!firm.dni_poseedor,
                        dni_responsable: !!firm.dni_responsable,
                        escribano: !!firm.escribano,
                        cuil_empresa: !!firm.cuil_empresa
                    },
                    doc_firmante: firm.doc_firmante || "Sin detalles de documentación.",
                    notas_relevamiento: data.notas_relevamiento || "",
                    mojones: data.mojones ? true : false,
                    fecha_mojones: data.fecha_mojones || null,
                    cotizacion: {
                        items: (pres.items || []).map((i: any) => ({
                            id: i.id,
                            servicioId: i.servicio_id,
                            nombre: i.nombre,
                            montoBase: Number(i.monto_base),
                            unidadBase: i.unidad_base,
                            montoVariable: Number(i.monto_variable),
                            unidadVariable: i.unidad_variable,
                            cantidadVariable: i.cantidad_variable,
                            montoVariable2: Number(i.monto_variable2 || 0),
                            unidadVariable2: i.unidad_variable2 || "",
                            cantidadVariable2: i.cantidad_variable2 || 0,
                            montoPorcentaje: Number(i.monto_porcentaje || 0),
                            porcentaje: Number(i.porcentaje || 0),
                            totalItem: Number(i.total_item),
                            realizado: Boolean(i.realizado),
                            fechaRealizacion: i.fecha_realizacion ? i.fecha_realizacion.split('T')[0] : ""
                        })),
                        tiempoEjecucion: pres.tiempo_ejecucion || "-",
                        requisitos: pres.requisitos || "-",
                        senas: Number(pres.senas || 0),
                        cantidadCuotas: Number(pres.cantidad_cuotas || 1),
                        cuotasIguales: Boolean(pres.cuotas_iguales),
                        cuotas: (pres.cuotas || []).map((c: any) => ({
                            id: c.id,
                            numero: c.numero,
                            monto: Number(c.monto),
                            pagado: Boolean(c.pagado),
                            fecha_pago: c.fecha_pago
                        })),
                        subtotal: Number(pres.subtotal_servicios || 0),
                        total: Number(pres.total_a_pagar || 0)
                    },
                    historial: [
                        { fecha: formatDate(new Date()), evento: "Carga de datos desde sistema" }
                    ]
                });
                setCargando(false);
            })
            .catch((err: any) => {
                console.error("Error al cargar detalle:", err);
                setCargando(false);
            });
    };

    useEffect(() => {
        cargarExpediente();
    }, [id]);

    // --- Lógica de Edición Global ---
    const iniciarEdicionGlobal = () => {
        setDatosEditSeccion(JSON.parse(JSON.stringify(expediente)));
        setModoEdicion(true);
    };

    const cancelarEdicionGlobal = () => {
        setModoEdicion(false);
        setDatosEditSeccion(null);
    };

    const handleChangeSeccion = (campo: string, valor: any) => {
        setDatosEditSeccion((prev: any) => ({ ...prev, [campo]: valor }));
    };

    const handleChecklistChange = (key: string, valor: boolean) => {
        setDatosEditSeccion((prev: any) => ({
            ...prev,
            checklist_firmante: {
                ...prev.checklist_firmante,
                [key]: valor
            }
        }));
    };

    const handleFileUpload = async (campo: string, file: File | undefined) => {
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
                handleChangeSeccion(campo, data.archivo);
            } else {
                alert("Error al subir archivo: " + data.mensaje);
            }
        } catch (error) {
            console.error("Error al subir archivo:", error);
            alert("Error al conectar con el servidor de subida");
        }
    };

    const guardarCambios = () => {
        if (!datosEditSeccion) return;

        // Función auxiliar para limpiar datos antes de enviar
        const cleanSendNum = (val: any) => {
            if (val === null || val === undefined || val === "" || val === "-") return null;
            return Number(val);
        };

        const cleanSendDate = (val: any) => {
            if (!val || val === "-" || val === "S/D") return null;
            // Si es un objeto Date o un string ISO, extraer solo YYYY-MM-DD
            if (typeof val === 'string' && val.includes('T')) {
                return val.split('T')[0];
            }
            return val;
        };

        // Calculamos los totales para asegurar consistencia
        const subtotal = totalServiciosActual;
        const total = totalServiciosActual;

        const payload = {
            ...datosEditSeccion,
            // Campos raíz para el backend
            objeto: datosEditSeccion.objeto,
            cliente: datosEditSeccion.cliente,
            cliente_id: datosEditSeccion.cliente_id,
            cliente_dni: datosEditSeccion.cliente_dni,
            cliente_telefono: datosEditSeccion.cliente_telefono,
            cliente_email: datosEditSeccion.cliente_email,
            cliente_direccion: datosEditSeccion.cliente_direccion,
            cliente_localidad: datosEditSeccion.cliente_localidad,
            cliente_provincia: datosEditSeccion.cliente_provincia,
            responsable: datosEditSeccion.responsable,

            // Nomenclatura (Asegurar que vayan como números o null)
            depto: datosEditSeccion.depto,
            municipio: cleanSendNum(datosEditSeccion.municipio),
            seccion: cleanSendNum(datosEditSeccion.seccion),
            chacra: cleanSendNum(datosEditSeccion.chacra),
            manzana: cleanSendNum(datosEditSeccion.manzana),
            parcela: datosEditSeccion.parcela,
            lote: datosEditSeccion.lote,
            partida_inmobiliaria: datosEditSeccion.partida_inmobiliaria,

            // Fechas DGC y Relevamiento - LIMPIAS PARA MYSQL
            presentacion_dgc: cleanSendDate(datosEditSeccion.presentacion_dgc),
            previa_dgc: cleanSendDate(datosEditSeccion.previa_dgc),
            definitiva_dgc: cleanSendDate(datosEditSeccion.definitiva_dgc),
            visado_dgc: cleanSendDate(datosEditSeccion.visado_dgc),
            expediente_n: datosEditSeccion.expediente_n,
            fecha_apertura: cleanSendDate(datosEditSeccion.fecha_apertura),
            fecha_relevamiento: cleanSendDate(datosEditSeccion.fecha_relevamiento),
            fecha_presupuesto: cleanSendDate(datosEditSeccion.fecha_presupuesto),
            fecha_ingreso_dominio: cleanSendDate(datosEditSeccion.fecha_ingreso_dominio),
            fecha_egreso_dominio: cleanSendDate(datosEditSeccion.fecha_egreso_dominio),
            fecha_libre_deuda: cleanSendDate(datosEditSeccion.fecha_libre_deuda),

            importe_presupuesto: total,
            terminado: !!datosEditSeccion.terminado,
            mojones: datosEditSeccion.mojones,
            fecha_mojones: cleanSendDate(datosEditSeccion.fecha_mojones),

            terreno_detalle: {
                designacion: datosEditSeccion.terreno,
                direccion: datosEditSeccion.ubicacion,
                latitud: cleanSendNum(datosEditSeccion.coords?.[0]),
                longitud: cleanSendNum(datosEditSeccion.coords?.[1]),
                pdf_catastro: datosEditSeccion.pdf_catastro,
                pdf_ploteo: datosEditSeccion.pdf_ploteo,
                cert_catastral: datosEditSeccion.cert_catastral,
                depto: datosEditSeccion.depto,
                municipio: cleanSendNum(datosEditSeccion.municipio),
                seccion: cleanSendNum(datosEditSeccion.seccion),
                chacra: cleanSendNum(datosEditSeccion.chacra),
                manzana: cleanSendNum(datosEditSeccion.manzana),
                parcela: datosEditSeccion.parcela,
                lote: datosEditSeccion.lote,
                superficie: datosEditSeccion.superficie
            },
            firmante_detalle: {
                tipo_firmante: datosEditSeccion.tipo_firmante,
                libre_deuda: !!datosEditSeccion.checklist_firmante?.libre_deuda,
                dni_titular: !!datosEditSeccion.checklist_firmante?.dni_titular,
                dni_poseedor: !!datosEditSeccion.checklist_firmante?.dni_poseedor,
                dni_responsable: !!datosEditSeccion.checklist_firmante?.dni_responsable,
                escribano: !!datosEditSeccion.checklist_firmante?.escribano,
                cuil_empresa: !!datosEditSeccion.checklist_firmante?.cuil_empresa,
                doc_firmante: datosEditSeccion.doc_firmante
            },
            notas_relevamiento: datosEditSeccion.notas_relevamiento,
            presupuesto_detalle: {
                tiempo_ejecucion: datosEditSeccion.cotizacion?.tiempoEjecucion,
                requisitos: datosEditSeccion.cotizacion?.requisitos,
                senas: cleanSendNum(datosEditSeccion.cotizacion?.senas) || 0,
                cantidad_cuotas: (datosEditSeccion.cotizacion?.cuotas && datosEditSeccion.cotizacion?.cuotas.length > 0)
                    ? datosEditSeccion.cotizacion.cuotas.length
                    : (cleanSendNum(datosEditSeccion.cotizacion?.cantidadCuotas) || 1),
                cuotas_iguales: !!datosEditSeccion.cotizacion?.cuotasIguales,
                subtotal_servicios: subtotal,
                total_a_pagar: total,
                cuotas: (datosEditSeccion.cotizacion?.cuotas || []).map((c: any) => ({
                    numero: cleanSendNum(c.numero),
                    monto: cleanSendNum(c.monto) || 0,
                    pagado: !!c.pagado,
                    fecha_pago: cleanSendDate(c.fechaPago || c.fecha_pago)
                })),
                items: (datosEditSeccion.cotizacion?.items || []).map((i: any) => ({
                    servicio_id: cleanSendNum(i.servicioId || i.servicio_id),
                    nombre: i.nombre,
                    monto_base: cleanSendNum(i.montoBase || i.monto_base) || 0,
                    unidad_base: i.unidadBase || i.unidad_base,
                    monto_variable: cleanSendNum(i.montoVariable || i.monto_variable) || 0,
                    unidad_variable: i.unidadVariable || i.unidad_variable || "",
                    cantidad_variable: cleanSendNum(i.cantidadVariable || i.cantidad_variable) || 0,
                    monto_variable2: cleanSendNum(i.montoVariable2 || i.monto_variable2) || 0,
                    unidad_variable2: i.unidadVariable2 || i.unidad_variable2 || "",
                    cantidad_variable2: cleanSendNum(i.cantidadVariable2 || i.cantidad_variable2) || 0,
                    monto_porcentaje: cleanSendNum(i.montoPorcentaje || i.monto_porcentaje) || 0,
                    porcentaje: cleanSendNum(i.porcentaje) || 0,
                    total_item: cleanSendNum(i.totalItem || i.total_item) || 0,
                    realizado: !!i.realizado,
                    fecha_realizacion: cleanSendDate(i.fechaRealizacion || i.fecha_realizacion)
                }))
            }
        };

        console.log("DEBUG: Guardando payload Global", payload);
        fetch(`http://localhost:4000/api/expedientes/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                console.log("DEBUG: Respuesta servidor", data);
                if (data.success) {
                    cargarExpediente();
                    setModoEdicion(false);
                    setDatosEditSeccion(null);
                } else {
                    alert("Error al guardar: " + (data.mensaje || "Desconocido") + "\n\nDetalle: " + (data.error || "Sin detalles"));
                }
            })
            .catch((err: Error) => {
                console.error("Error al guardar cambios globales:", err);
                alert("Error crítico al conectar con el servidor. Revisa la consola.");
            });
    };

    // --- Lógica del Presupuesto ---
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

    const categoriasVisibles = categoriasHonorarios;
    const serviciosVisibles = useMemo(() => {
        if (catSeleccionada === "") return [];
        return categoriasVisibles.find((c: any) => c.id === catSeleccionada)?.servicios.filter((s: any) => !s.esTitulo) || [];
    }, [catSeleccionada, categoriasHonorarios]);

    const agregarServicioACotizacion = () => {
        if (servSeleccionado === "" || !datosEditSeccion) return;
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

        setDatosEditSeccion((prev: any) => ({
            ...prev,
            cotizacion: {
                ...prev.cotizacion,
                items: [...prev.cotizacion.items, nuevoItem]
            }
        }));
        setServSeleccionado("");
    };

    const actualizarItemCotizacion = (itemId: number, campo: string, valor: any) => {
        setDatosEditSeccion((prev: any) => {
            const nuevosItems = prev.cotizacion.items.map((item: any) => {
                if (item.id === itemId) {
                    const act = { ...item, [campo]: valor };
                    act.totalItem = Number(act.montoBase)
                        + (Number(act.montoVariable) * Number(act.cantidadVariable || 0))
                        + (Number(act.montoVariable2 || 0) * Number(act.cantidadVariable2 || 0))
                        + (Number(act.montoPorcentaje || 0) * Number(act.porcentaje || 0) / 100);
                    return act;
                }
                return item;
            });
            return {
                ...prev,
                cotizacion: { ...prev.cotizacion, items: nuevosItems }
            };
        });
    };

    const eliminarItemCotizacion = (itemId: number) => {
        setDatosEditSeccion((prev: any) => ({
            ...prev,
            cotizacion: {
                ...prev.cotizacion,
                items: prev.cotizacion.items.filter((i: any) => i.id !== itemId)
            }
        }));
    };

    const handleCuotaChange = (numero: number, campo: string, valor: any) => {
        setDatosEditSeccion((prev: any) => {
            const nuevasCuotas = prev.cotizacion.cuotas.map((c: any) =>
                c.numero === numero ? { ...c, [campo]: valor } : c
            );
            return {
                ...prev,
                cotizacion: { ...prev.cotizacion, cuotas: nuevasCuotas }
            };
        });
    };

    const regenerarCuotas = (cantidad: number, iguales: boolean) => {
        const base = totalServiciosActual - (datosEditSeccion?.cotizacion.senas || 0);
        const montoIndividual = cantidad > 0 ? base / cantidad : 0;

        const nuevas = Array.from({ length: cantidad }, (_, i) => ({
            id: Date.now() + i,
            numero: i + 1,
            monto: iguales ? Number(montoIndividual.toFixed(2)) : 0,
            pagado: false,
            fechaPago: null
        }));

        handleChangeSeccion("cotizacion", {
            ...datosEditSeccion.cotizacion,
            cantidadCuotas: cantidad,
            cuotasIguales: iguales,
            cuotas: nuevas
        });
    };

    const totalServiciosActual = useMemo(() => {
        const obj = datosEditSeccion || expediente;
        if (!obj || !obj.cotizacion) return 0;
        return obj.cotizacion.items.reduce((acc: number, curr: any) => acc + curr.totalItem, 0);
    }, [datosEditSeccion?.cotizacion.items, expediente.cotizacion.items]);

    const saldoPendienteActual = useMemo(() => {
        const obj = datosEditSeccion || expediente;
        if (!obj || !obj.cotizacion) return 0;
        const total = totalServiciosActual;
        const sena = Number(obj.cotizacion.senas || 0);
        const pagosCuotas = (obj.cotizacion.cuotas || []).reduce((acc: number, c: any) => acc + (c.pagado ? Number(c.monto) : 0), 0);
        return total - sena - pagosCuotas;
    }, [datosEditSeccion?.cotizacion, expediente.cotizacion, totalServiciosActual]);

    const handleMapClick = async (lat: number, lng: number) => {
        handleChangeSeccion("coords", [lat, lng]);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            if (data && data.display_name) {
                handleChangeSeccion("ubicacion", data.display_name);
            }
        } catch (error) {
            console.error("Error geocoding", error);
        }
    };




    if (cargando) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8f9fa' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
                    <p>Cargando detalles del expediente...</p>
                </div>
            </div>
        );
    }

    const dg = modoEdicion ? datosEditSeccion : expediente;
    const itemsPresupuesto = (modoEdicion ? datosEditSeccion : expediente).cotizacion.items;
    const mostrarColumnaPorcentaje = modoEdicion || itemsPresupuesto.some((i: any) => i.montoPorcentaje > 0 || i.porcentaje > 0);

    return (
        <div className="detalle-exp-pagina">
            <BarraLateralIzquierda abierto={menuAbierto} alCerrar={() => setMenuAbierto(false)} />

            <header style={{ marginBottom: "20px" }} className="no-print">
                <button className="boton-menu-unificado" type="button" onClick={() => setMenuAbierto(true)} aria-label="Abrir menú">☰</button>
            </header>

            <div className="detalle-header-grande">
                <div className="detalle-titulo-bloque" style={{ flex: 1, minWidth: '300px' }}>
                    <h1 style={{ textTransform: 'uppercase' }}>{dg.cliente} - {dg.numero}</h1>
                    <div className="detalle-nro">ID: {id} — {dg.objeto || "Sin Objeto"}</div>
                </div>

                <div className="acciones-detalle no-print">
                    <button className="expedientes-boton expedientes-boton-secundario" onClick={() => navigate("/expedientes")}>Volver</button>
                    {!modoEdicion ? (
                        <>
                            <button className="expedientes-boton" style={{ background: "#e8eaf6", color: "#303f9f", marginRight: '10px' }} onClick={() => setShowFichaModal(true)}>Imprimir Ficha</button>
                            <button className="expedientes-boton expedientes-boton-principal" onClick={iniciarEdicionGlobal}>Editar Expediente</button>
                        </>
                    ) : (
                        <>
                            <button className="expedientes-boton expedientes-boton-secundario" style={{ marginRight: '10px' }} onClick={cancelarEdicionGlobal}>Cancelar</button>
                            <button className="expedientes-boton expedientes-boton-principal" onClick={guardarCambios}>Guardar Cambios</button>
                        </>
                    )}
                </div>
            </div>

            {/* SECCIÓN: DATOS GENERALES */}
            <div className="tarjeta-detalle" style={{ marginBottom: "24px", position: 'relative' }}>
                <div className="tarjeta-titulo">Datos Generales del Proyecto</div>

                <div className="datos-generales-grid">
                    <div className="dato-resumen">
                        <label>Nombre del Proyecto / Objeto</label>
                        {modoEdicion ? (
                            <input className="expedientes-input" value={datosEditSeccion.objeto || ""} onChange={e => handleChangeSeccion("objeto", e.target.value)} />
                        ) : (
                            <strong>{expediente.objeto || "Sin Objeto"}</strong>
                        )}
                    </div>
                    <div className="dato-resumen">
                        <label>Titular / Cliente</label>
                        {modoEdicion ? (
                            <input className="expedientes-input" value={datosEditSeccion.cliente || ""} onChange={e => handleChangeSeccion("cliente", e.target.value)} />
                        ) : (
                            <strong>{dg.cliente}</strong>
                        )}
                    </div>
                    <div className="dato-resumen">
                        <label>Terreno (Nombre)</label>
                        {modoEdicion ? (
                            <input className="expedientes-input" value={datosEditSeccion.terreno} onChange={e => handleChangeSeccion("terreno", e.target.value)} />
                        ) : (
                            <strong>{expediente.terreno}</strong>
                        )}
                    </div>
                    <div className="dato-resumen">
                        <label>Fecha Apertura</label>
                        {modoEdicion ? (
                            <input type="date" className="expedientes-input" value={datosEditSeccion.fecha_apertura ? datosEditSeccion.fecha_apertura.split('T')[0] : ""} onChange={e => handleChangeSeccion("fecha_apertura", e.target.value)} />
                        ) : (
                            <strong>{expediente.fechas.creado}</strong>
                        )}
                    </div>
                    <div className="dato-resumen">
                        <label>Relevamiento</label>
                        {modoEdicion ? (
                            <input type="date" className="expedientes-input" value={datosEditSeccion.fecha_relevamiento ? (typeof datosEditSeccion.fecha_relevamiento === 'string' && datosEditSeccion.fecha_relevamiento.includes('T') ? datosEditSeccion.fecha_relevamiento.split('T')[0] : datosEditSeccion.fecha_relevamiento) : ""} onChange={e => handleChangeSeccion("fecha_relevamiento", e.target.value)} />
                        ) : (
                            <strong>{expediente.fechas.relevamiento}</strong>
                        )}
                    </div>
                    <div className="dato-resumen">
                        <label>Mojones</label>
                        {modoEdicion ? (
                            <select className="expedientes-input" value={datosEditSeccion.mojones ? "true" : "false"} onChange={e => handleChangeSeccion("mojones", e.target.value === "true")}>
                                <option value="false">NO</option>
                                <option value="true">SÍ</option>
                            </select>
                        ) : (
                            <strong>{expediente.mojones ? "SÍ" : "NO"}</strong>
                        )}
                    </div>
                    <div className="dato-resumen">
                        <label>Visado</label>
                        {modoEdicion ? (
                            <input type="date" className="expedientes-input" value={datosEditSeccion.visado_dgc ? datosEditSeccion.visado_dgc.split('T')[0] : ""} onChange={e => handleChangeSeccion("visado_dgc", e.target.value)} />
                        ) : (
                            <strong>{expediente.fechas.visado}</strong>
                        )}
                    </div>
                    <div className="dato-resumen">
                        <label>Estado</label>
                        {modoEdicion ? (
                            <select className="expedientes-input" value={datosEditSeccion.terminado ? "1" : "0"} onChange={e => handleChangeSeccion("terminado", e.target.value === "1")}>
                                <option value="0">En Proceso</option>
                                <option value="1">Finalizado</option>
                            </select>
                        ) : (
                            <span className={`estado-badge ${expediente.terminado ? "estado-finalizado" : "estado-en-proceso"}`}>
                                {expediente.estado}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="detalle-grid">
                <div className="detalle-col-izq-grid">
                    {/* SECCIÓN: CLIENTE Y CONTACTO */}
                    <div className="tarjeta-detalle" style={{ position: 'relative' }}>
                        <div className="tarjeta-titulo">Información del Cliente y Contacto</div>

                        <div className="dato-fila">
                            <span className="dato-label">Nombre / Titular</span>
                            {modoEdicion ? (
                                <input className="expedientes-input" value={datosEditSeccion.cliente || ""} onChange={e => handleChangeSeccion("cliente", e.target.value)} />
                            ) : (
                                <span className="dato-valor">{dg.cliente}</span>
                            )}
                        </div>
                        <div className="dato-fila">
                            <span className="dato-label">DNI/CUIL</span>
                            {modoEdicion ? (
                                <input className="expedientes-input" value={datosEditSeccion.cliente_dni || ""} onChange={e => handleChangeSeccion("cliente_dni", e.target.value)} />
                            ) : (
                                <span className="dato-valor">{dg.cliente_dni}</span>
                            )}
                        </div>
                        <div className="dato-fila">
                            <span className="dato-label">Teléfono</span>
                            {modoEdicion ? (
                                <input className="expedientes-input" value={datosEditSeccion.cliente_telefono || ""} onChange={e => handleChangeSeccion("cliente_telefono", e.target.value)} />
                            ) : (
                                <span className="dato-valor">{dg.cliente_telefono}</span>
                            )}
                        </div>
                        <div className="dato-fila">
                            <span className="dato-label">Email</span>
                            {modoEdicion ? (
                                <input className="expedientes-input" type="email" value={datosEditSeccion.cliente_email || ""} onChange={e => handleChangeSeccion("cliente_email", e.target.value)} />
                            ) : (
                                <span className="dato-valor">{dg.cliente_email}</span>
                            )}
                        </div>
                        <div className="dato-fila">
                            <span className="dato-label" style={{ fontWeight: 700 }}>Usuario del Portal</span>
                            <span className="dato-valor">
                                {expediente.tiene_usuario ? (
                                    <span style={{ color: '#2e7d32', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        ✅ Activo
                                    </span>
                                ) : (
                                    <span style={{ color: '#666', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        ❌ Sin usuario vinculado
                                    </span>
                                )}
                            </span>
                        </div>
                        <div className="dato-fila">
                            <span className="dato-label">Localidad</span>
                            {modoEdicion ? (
                                <input className="expedientes-input" value={datosEditSeccion.cliente_localidad || ""} onChange={e => handleChangeSeccion("cliente_localidad", e.target.value)} />
                            ) : (
                                <span className="dato-valor">{dg.cliente_localidad}</span>
                            )}
                        </div>
                        <div className="dato-fila">
                            <span className="dato-label">Provincia</span>
                            {modoEdicion ? (
                                <input className="expedientes-input" value={datosEditSeccion.cliente_provincia || ""} onChange={e => handleChangeSeccion("cliente_provincia", e.target.value)} />
                            ) : (
                                <span className="dato-valor">{dg.cliente_provincia}</span>
                            )}
                        </div>
                        <div className="dato-fila">
                            <span className="dato-label">Responsable</span>
                            {modoEdicion ? (
                                <input className="expedientes-input" value={datosEditSeccion.responsable || ""} onChange={e => handleChangeSeccion("responsable", e.target.value)} />
                            ) : (
                                <span className="dato-valor">{expediente.responsable || "S/D"}</span>
                            )}
                        </div>
                    </div>

                    {/* SECCIÓN: NOMENCLATURA */}
                    <div className="tarjeta-detalle" style={{ position: 'relative' }}>
                        <div className="tarjeta-titulo">Nomenclatura Catastral</div>

                        <div className="datos-generales-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gridAutoFlow: "row" }}>
                            <div className="dato-resumen"><label>Depto</label>{modoEdicion ? <input className="expedientes-input" value={datosEditSeccion.depto || ""} onChange={e => handleChangeSeccion("depto", e.target.value)} /> : <strong>{expediente.depto || "-"}</strong>}</div>
                            <div className="dato-resumen"><label>Municipio</label>{modoEdicion ? <input className="expedientes-input" value={datosEditSeccion.municipio || ""} onChange={e => handleChangeSeccion("municipio", e.target.value)} /> : <strong>{expediente.municipio || "-"}</strong>}</div>
                            <div className="dato-resumen"><label>Sección</label>{modoEdicion ? <input className="expedientes-input" value={datosEditSeccion.seccion || ""} onChange={e => handleChangeSeccion("seccion", e.target.value)} /> : <strong>{expediente.seccion || "-"}</strong>}</div>
                            <div className="dato-resumen"><label>Chacra</label>{modoEdicion ? <input className="expedientes-input" value={datosEditSeccion.chacra || ""} onChange={e => handleChangeSeccion("chacra", e.target.value)} /> : <strong>{expediente.chacra || "-"}</strong>}</div>
                            <div className="dato-resumen"><label>Manzana</label>{modoEdicion ? <input className="expedientes-input" value={datosEditSeccion.manzana || ""} onChange={e => handleChangeSeccion("manzana", e.target.value)} /> : <strong>{expediente.manzana || "-"}</strong>}</div>
                            <div className="dato-resumen"><label>Parcela</label>{modoEdicion ? <input className="expedientes-input" value={datosEditSeccion.parcela || ""} onChange={e => handleChangeSeccion("parcela", e.target.value)} /> : <strong>{expediente.parcela || "-"}</strong>}</div>
                            <div className="dato-resumen"><label>Lote</label>{modoEdicion ? <input className="expedientes-input" value={datosEditSeccion.lote || ""} onChange={e => handleChangeSeccion("lote", e.target.value)} /> : <strong>{expediente.lote || "-"}</strong>}</div>
                            <div className="dato-resumen"><label>Partida</label>{modoEdicion ? <input className="expedientes-input" value={datosEditSeccion.partida_inmobiliaria || ""} onChange={e => handleChangeSeccion("partida_inmobiliaria", e.target.value)} /> : <strong>{expediente.partida_inmobiliaria || "-"}</strong>}</div>
                        </div>

                        <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                className="expedientes-boton no-print"
                                style={{ background: "#f1f8e9", color: "#2e7d32", fontSize: '0.85rem' }}
                                onClick={generarPeticionCatastro}
                            >
                                📄 Generar Petición Catastro
                            </button>
                            {ultimaPeticionCatastro?.existe && (
                                <a
                                    href={`http://localhost:4000/api/expedientes/${id}/descargar-ultima-peticion-catastro`}
                                    className="expedientes-boton no-print"
                                    style={{ background: "#e3f2fd", color: "#1565c0", fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                                    title={`Generado el: ${ultimaPeticionCatastro.fecha}`}
                                >
                                    ⬇️ Volver a Descargar
                                </a>
                            )}
                        </div>
                    </div>

                    {/* SECCIÓN: TERRENO (MAPA) */}
                    <div className="tarjeta-detalle terreno-span" style={{ padding: 0, overflow: "hidden", position: 'relative' }}>
                        <div style={{ padding: "16px 24px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div className="tarjeta-titulo" style={{ margin: 0, border: "none", padding: 0 }}>
                                Datos del Terreno {modoEdicion && <small style={{ fontWeight: 400, marginLeft: 10, color: "#666" }}>(Click mapa para mover)</small>}
                            </div>
                        </div>
                        <div className="mapa-terreno">
                            <MapContainer center={dg.coords} zoom={15} style={{ height: "100%", width: "100%" }}>
                                <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={dg.coords} />
                                {modoEdicion && <MapClickHandler onClick={handleMapClick} />}
                            </MapContainer>
                        </div>
                        <div style={{ padding: "24px" }}>
                            <div className="dato-fila">
                                <span className="dato-label">Designación (Nombre)</span>
                                {modoEdicion ? <input className="expedientes-input" value={datosEditSeccion.terreno} onChange={e => handleChangeSeccion("terreno", e.target.value)} /> : <span className="dato-valor">{expediente.terreno}</span>}
                            </div>
                            <div className="dato-fila">
                                <span className="dato-label">Dirección / Ubicación</span>
                                {modoEdicion ? <input className="expedientes-input" value={datosEditSeccion.ubicacion} onChange={e => handleChangeSeccion("ubicacion", e.target.value)} /> : <span className="dato-valor">{expediente.ubicacion}</span>}
                            </div>
                            <div className="dato-fila">
                                <span className="dato-label">Superficie Total (m²)</span>
                                {modoEdicion ? <input className="expedientes-input" value={datosEditSeccion.superficie} onChange={e => handleChangeSeccion("superficie", e.target.value)} /> : <span className="dato-valor">{expediente.superficie || "S/D"}</span>}
                            </div>

                            {/* NUEVOS CAMPOS: PLOTEO Y CERTIFICADO */}
                            <div className="dato-fila" style={{ alignItems: 'center' }}>
                                <span className="dato-label">Ploteo (PDF)</span>
                                {modoEdicion ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <label style={{
                                            cursor: 'pointer',
                                            padding: '8px 12px',
                                            background: 'rgba(var(--principal-rgb), 0.05)',
                                            borderRadius: '10px',
                                            fontSize: '0.85rem',
                                            color: 'var(--principal)',
                                            textAlign: 'center',
                                            border: '1px dashed rgba(var(--principal-rgb), 0.3)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}>
                                            {datosEditSeccion.pdf_ploteo ? "🔄 Cambiar Archivo" : "📁 Subir Ploteo"}
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={e => handleFileUpload("pdf_ploteo", e.target.files?.[0])}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                        {datosEditSeccion.pdf_ploteo && (
                                            <small style={{ color: '#2e7d32', fontSize: '0.7rem', fontWeight: 600 }}>
                                                ✓ {datosEditSeccion.pdf_ploteo.length > 25 ? datosEditSeccion.pdf_ploteo.substring(0, 25) + '...' : datosEditSeccion.pdf_ploteo}
                                            </small>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span className="dato-valor" style={{ fontSize: '0.85rem' }}>{expediente.pdf_ploteo ? "Disponible" : "Sin archivo"}</span>
                                        {expediente.pdf_ploteo && (
                                            <button
                                                className="expedientes-boton expedientes-boton-secundario"
                                                style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '8px' }}
                                                onClick={() => window.open(`http://localhost:4000/uploads/${expediente.pdf_ploteo}`, '_blank')}
                                            >
                                                📄 Ver/Imprimir
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="dato-fila" style={{ alignItems: 'center' }}>
                                <span className="dato-label">Certificado Catastral</span>
                                {modoEdicion ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <label style={{
                                            cursor: 'pointer',
                                            padding: '8px 12px',
                                            background: 'rgba(var(--principal-rgb), 0.05)',
                                            borderRadius: '10px',
                                            fontSize: '0.85rem',
                                            color: 'var(--principal)',
                                            textAlign: 'center',
                                            border: '1px dashed rgba(var(--principal-rgb), 0.3)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}>
                                            {datosEditSeccion.cert_catastral ? "🔄 Cambiar Archivo" : "📁 Subir Certificado"}
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={e => handleFileUpload("cert_catastral", e.target.files?.[0])}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                        {datosEditSeccion.cert_catastral && (
                                            <small style={{ color: '#2e7d32', fontSize: '0.7rem', fontWeight: 600 }}>
                                                ✓ {datosEditSeccion.cert_catastral.length > 25 ? datosEditSeccion.cert_catastral.substring(0, 25) + '...' : datosEditSeccion.cert_catastral}
                                            </small>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span className="dato-valor" style={{ fontSize: '0.85rem' }}>{expediente.cert_catastral ? "Disponible" : "Sin archivo"}</span>
                                        {expediente.cert_catastral && (
                                            <button
                                                className="expedientes-boton expedientes-boton-secundario"
                                                style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '8px' }}
                                                onClick={() => window.open(`http://localhost:4000/uploads/${expediente.cert_catastral}`, '_blank')}
                                            >
                                                📄 Ver/Imprimir
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {/* SECCIÓN: RELEVAMIENTO Y CAMPO */}
                    <div className="tarjeta-detalle" style={{ position: 'relative' }}>
                        <div className="tarjeta-titulo">Relevamiento y Campo</div>

                        <div className="dato-fila">
                            <span className="dato-label">Fecha Relevamiento</span>
                            {modoEdicion ? (
                                <input type="date" className="expedientes-input" value={datosEditSeccion.fecha_relevamiento ? (typeof datosEditSeccion.fecha_relevamiento === 'string' && datosEditSeccion.fecha_relevamiento.includes('T') ? datosEditSeccion.fecha_relevamiento.split('T')[0] : datosEditSeccion.fecha_relevamiento) : ""} onChange={e => handleChangeSeccion("fecha_relevamiento", e.target.value || null)} />
                            ) : (
                                <span className="dato-valor">{expediente.fechas.relevamiento}</span>
                            )}
                        </div>

                        <div className="dato-fila">
                            <span className="dato-label">Mojones</span>
                            {modoEdicion ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                        <input type="checkbox" checked={!!datosEditSeccion.mojones} onChange={e => handleChangeSeccion("mojones", e.target.checked)} />
                                        <span>Colocar Mojones</span>
                                    </label>
                                    {datosEditSeccion.mojones && (
                                        <input type="date" className="expedientes-input" style={{ width: '150px' }} value={datosEditSeccion.fecha_mojones ? (typeof datosEditSeccion.fecha_mojones === 'string' && datosEditSeccion.fecha_mojones.includes('T') ? datosEditSeccion.fecha_mojones.split('T')[0] : datosEditSeccion.fecha_mojones) : ""} onChange={e => handleChangeSeccion("fecha_mojones", e.target.value || null)} />
                                    )}
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span className="dato-valor">{expediente.mojones ? "SÍ" : "NO"}</span>
                                    {expediente.mojones && expediente.fecha_mojones && (
                                        <span style={{ fontSize: '0.85rem', color: '#666' }}>(Fecha: {formatDate(expediente.fecha_mojones)})</span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="dato-fila" style={{ marginTop: '10px' }}>
                            <span className="dato-label" style={{ alignSelf: 'flex-start' }}>Notas Relevamiento</span>
                            {modoEdicion ? (
                                <textarea className="expedientes-input" value={datosEditSeccion.notas_relevamiento || ""} onChange={e => handleChangeSeccion("notas_relevamiento", e.target.value)} style={{ width: '100%', height: '80px' }} />
                            ) : (
                                <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem', color: '#444' }}>{expediente.notas_relevamiento || "Sin notas de relevamiento."}</div>
                            )}
                        </div>
                    </div>

                    {/* SECCIÓN: TRAMITE CATASTRO */}
                    <div className="tarjeta-detalle" style={{ position: 'relative' }}>
                        <div className="tarjeta-titulo">Trámite Catastro (DGC)</div>

                        <div className="dato-fila">
                            <span className="dato-label">Presentación DGC</span>
                            {modoEdicion ? <input type="date" className="expedientes-input" value={datosEditSeccion.presentacion_dgc ? datosEditSeccion.presentacion_dgc.split('T')[0] : ""} onChange={e => handleChangeSeccion("presentacion_dgc", e.target.value || null)} /> : <span className="dato-valor">{expediente.fechas.presentacion_dgc}</span>}
                        </div>
                        <div className="dato-fila">
                            <span className="dato-label">Previa DGC</span>
                            {modoEdicion ? <input type="date" className="expedientes-input" value={datosEditSeccion.previa_dgc ? datosEditSeccion.previa_dgc.split('T')[0] : ""} onChange={e => handleChangeSeccion("previa_dgc", e.target.value || null)} /> : <span className="dato-valor">{expediente.fechas.previa_dgc}</span>}
                        </div>
                        <div className="dato-fila">
                            <span className="dato-label">Definitiva DGC</span>
                            {modoEdicion ? <input type="date" className="expedientes-input" value={datosEditSeccion.definitiva_dgc ? datosEditSeccion.definitiva_dgc.split('T')[0] : ""} onChange={e => handleChangeSeccion("definitiva_dgc", e.target.value || null)} /> : <span className="dato-valor">{expediente.fechas.definitiva_dgc}</span>}
                        </div>
                        <div className="dato-fila">
                            <span className="dato-label">Visado DGC</span>
                            {modoEdicion ? <input type="date" className="expedientes-input" value={datosEditSeccion.visado_dgc ? datosEditSeccion.visado_dgc.split('T')[0] : ""} onChange={e => handleChangeSeccion("visado_dgc", e.target.value || null)} /> : <span className="dato-valor">{expediente.fechas.visado}</span>}
                        </div>
                        <div className="dato-fila">
                            <span className="dato-label">Nº expte</span>
                            {modoEdicion ? <input className="expedientes-input" value={datosEditSeccion.expediente_n || ""} onChange={e => handleChangeSeccion("expediente_n", e.target.value)} /> : <span className="dato-valor">{expediente.expediente_n || "-"}</span>}
                        </div>
                    </div>

                    {/* SECCIÓN: MUNICIPAL */}
                    <div className="tarjeta-detalle" style={{ position: 'relative' }}>
                        <div className="tarjeta-titulo">Trámite Municipal / Otros</div>

                        <div className="dato-fila">
                            <span className="dato-label">Expte. Muni</span>
                            {modoEdicion ? <input className="expedientes-input" value={datosEditSeccion.expte_muni || ""} onChange={e => handleChangeSeccion("expte_muni", e.target.value)} /> : <span className="dato-valor">{expediente.expte_muni || "-"}</span>}
                        </div>
                        <div className="dato-fila">
                            <span className="dato-label">Aprobación Muni</span>
                            {modoEdicion ? <input type="checkbox" checked={!!datosEditSeccion.aprobacion_muni} onChange={e => handleChangeSeccion("aprobacion_muni", e.target.checked)} /> : <span className="dato-valor">{expediente.aprobacion_muni ? "SÍ" : "NO"}</span>}
                        </div>
                        <div className="dato-fila">
                            <span className="dato-label">Disposición N°</span>
                            {modoEdicion ? <input className="expedientes-input" value={datosEditSeccion.disposicion_n || ""} onChange={e => handleChangeSeccion("disposicion_n", e.target.value)} /> : <span className="dato-valor">{expediente.disposicion_n || "-"}</span>}
                        </div>
                    </div>

                    {/* SECCIÓN: FIRMANTE (Movido al lateral) */}
                    <div className="tarjeta-detalle" style={{ position: 'relative' }}>
                        <div className="tarjeta-titulo">Datos del Firmante ({dg.tipo_firmante})</div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '12px' }}>
                                <strong style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem' }}>Checklist:</strong>
                                {Object.keys(dg.checklist_firmante).map(key => {
                                    const labels: any = {
                                        libre_deuda: "Libre Deuda",
                                        dni_titular: "DNI Titular",
                                        dni_poseedor: "DNI Poseedor",
                                        dni_responsable: "DNI Responsable",
                                        escribano: "Escribano",
                                        cuil_empresa: "CUIL Empresa"
                                    };
                                    const estaEntregado = modoEdicion ? datosEditSeccion.checklist_firmante[key] : expediente.checklist_firmante[key];
                                    return (
                                        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                                            {modoEdicion && (
                                                <input
                                                    type="checkbox"
                                                    checked={estaEntregado}
                                                    onChange={e => handleChecklistChange(key, e.target.checked)}
                                                />
                                            )}
                                            <span style={{
                                                fontSize: '0.78rem',
                                                fontWeight: 'bold',
                                                color: estaEntregado ? '#2e7d32' : '#c62828'
                                            }}>
                                                {labels[key] || key}: {estaEntregado ? 'SÍ' : 'NO'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div>
                                <label className="dato-label" style={{ fontSize: '0.8rem' }}>Observaciones Documentación</label>
                                {modoEdicion ? (
                                    <textarea className="expedientes-input" value={datosEditSeccion.doc_firmante} onChange={e => handleChangeSeccion("doc_firmante", e.target.value)} style={{ width: '100%', height: '80px', marginTop: '5px' }} />
                                ) : (
                                    <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem', marginTop: '5px', color: '#444' }}>{expediente.doc_firmante}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="detalle-grid" style={{ marginTop: '24px', gridTemplateColumns: '1fr 1fr' }}>
                {/* SECCIÓN: MATERIALES */}
                <div className="tarjeta-detalle" style={{ position: 'relative' }}>
                    <div className="tarjeta-titulo">Materiales del Terreno</div>
                    {modoEdicion ? <textarea className="expedientes-input" value={datosEditSeccion.materiales} onChange={e => handleChangeSeccion("materiales", e.target.value)} style={{ width: '100%', minHeight: '100px' }} /> : <div style={{ whiteSpace: 'pre-wrap' }}>{expediente.materiales}</div>}
                </div>
                {/* SECCIÓN: NOTAS */}
                <div className="tarjeta-detalle" style={{ position: 'relative' }}>
                    <div className="tarjeta-titulo">Notas del Expediente</div>
                    {modoEdicion ? <textarea className="expedientes-input" value={datosEditSeccion.notas} onChange={e => handleChangeSeccion("notas", e.target.value)} style={{ width: '100%', minHeight: '100px' }} /> : <div style={{ whiteSpace: 'pre-wrap' }}>{expediente.notas}</div>}
                </div>
            </div>


            {/* SECCIÓN: PRESUPUESTO */}
            <div className="secciones-contenedor-full presupuesto-seccion">
                <div className="seccion-header-con-boton">
                    <h2 style={{ fontSize: "1.5rem", color: "var(--principal)", margin: 0 }}>Presupuesto y Cotización</h2>
                    <button
                        className="expedientes-boton no-print"
                        style={{ background: "#f1f8e9", color: "#2e7d32", fontSize: '0.9rem' }}
                        onClick={abrirModalPresupuesto}
                    >
                        📄 Imprimir Presupuesto
                    </button>
                    {ultimoPresupuesto?.existe && (
                        <a
                            href={`http://localhost:4000/api/expedientes/${id}/descargar-ultimo-presupuesto`}
                            className="expedientes-boton no-print"
                            style={{ background: "#e3f2fd", color: "#1565c0", fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', marginLeft: '10px' }}
                            title={`Generado el: ${ultimoPresupuesto.fecha}`}
                        >
                            Descargar Último ({ultimoPresupuesto.fecha?.split(',')[0]})
                        </a>
                    )}
                </div>
                <div className="tarjeta-detalle" style={{ marginTop: '20px', position: 'relative' }}>

                    {modoEdicion && (
                        <div className="selector-servicio-presupuesto no-print">
                            <div className="input-grupo">
                                <label>Categoría</label>
                                <select value={catSeleccionada} onChange={e => { setCatSeleccionada(Number(e.target.value)); setServSeleccionado(""); }}>
                                    <option value="">Seleccionar Categoría...</option>
                                    {categoriasVisibles.map((c: any) => <option key={c.id} value={c.id}>{c.tipo}</option>)}
                                </select>
                            </div>
                            <div className="input-grupo">
                                <label>Servicio</label>
                                <select value={servSeleccionado} onChange={e => setServSeleccionado(Number(e.target.value))} disabled={!catSeleccionada}>
                                    <option value="">Seleccionar Servicio...</option>
                                    {serviciosVisibles.map((s: any) => <option key={s.id} value={s.id}>{s.codigo} - {s.nombre}</option>)}
                                </select>
                            </div>
                            <button onClick={agregarServicioACotizacion} className="boton-principal" style={{ alignSelf: 'flex-end', height: '42px' }}>+ Agregar</button>
                        </div>
                    )}
                    <table className="tabla-presupuesto">
                        <thead>
                            <tr>
                                <th>Servicio</th>
                                <th>Base</th>
                                <th>Adicional</th>
                                {mostrarColumnaPorcentaje && <th>Porcentaje</th>}
                                <th>Total</th>
                                {modoEdicion && <th></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {(modoEdicion ? datosEditSeccion : expediente).cotizacion.items.map((item: any) => (
                                <tr key={item.id}>
                                    <td>{item.nombre}</td>
                                    <td>{modoEdicion ? <input type="number" className="input-presupuesto" value={item.montoBase} onChange={e => actualizarItemCotizacion(item.id, "montoBase", Number(e.target.value))} /> : `$${item.montoBase.toLocaleString()}`}</td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {item.montoVariable > 0 && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {modoEdicion ? (
                                                        <>
                                                            <input type="number" className="input-presupuesto" style={{ width: '60px' }} value={item.cantidadVariable} onChange={e => actualizarItemCotizacion(item.id, "cantidadVariable", Number(e.target.value))} />
                                                            <small style={{ minWidth: '60px' }}>{item.unidadVariable}</small>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderLeft: '1px solid #ddd', paddingLeft: '8px' }}>
                                                                <span style={{ fontSize: '0.75rem', color: '#888' }}>$</span>
                                                                <input type="number" className="input-presupuesto" style={{ width: '90px', padding: '4px 8px' }} value={item.montoVariable} onChange={e => actualizarItemCotizacion(item.id, "montoVariable", Number(e.target.value))} />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div style={{ fontSize: '0.85rem' }}>
                                                            <span style={{ fontWeight: 600 }}>$ {item.montoVariable.toLocaleString()}</span>
                                                            <span style={{ color: '#888', margin: '0 4px' }}>x</span>
                                                            <span>{item.cantidadVariable} {item.unidadVariable}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {item.montoVariable2 > 0 && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {modoEdicion ? (
                                                        <>
                                                            <input type="number" className="input-presupuesto" style={{ width: '60px' }} value={item.cantidadVariable2} onChange={e => actualizarItemCotizacion(item.id, "cantidadVariable2", Number(e.target.value))} />
                                                            <small style={{ minWidth: '60px' }}>{item.unidadVariable2}</small>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderLeft: '1px solid #ddd', paddingLeft: '8px' }}>
                                                                <span style={{ fontSize: '0.75rem', color: '#888' }}>$</span>
                                                                <input type="number" className="input-presupuesto" style={{ width: '90px', padding: '4px 8px' }} value={item.montoVariable2} onChange={e => actualizarItemCotizacion(item.id, "montoVariable2", Number(e.target.value))} />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div style={{ fontSize: '0.85rem' }}>
                                                            <span style={{ fontWeight: 600 }}>$ {item.montoVariable2.toLocaleString()}</span>
                                                            <span style={{ color: '#888', margin: '0 4px' }}>x</span>
                                                            <span>{item.cantidadVariable2} {item.unidadVariable2}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {item.montoVariable <= 0 && item.montoVariable2 <= 0 && "-"}
                                        </div>
                                    </td>
                                    {mostrarColumnaPorcentaje && (
                                        <td>
                                            {modoEdicion ? (
                                                (item.montoPorcentaje > 0 || item.porcentaje > 0) ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <input type="number" className="input-presupuesto" style={{ width: '90px', fontSize: '0.85rem' }} value={item.montoPorcentaje} onChange={e => actualizarItemCotizacion(item.id, "montoPorcentaje", Number(e.target.value))} placeholder="Monto" />
                                                            <button
                                                                onClick={() => {
                                                                    actualizarItemCotizacion(item.id, "montoPorcentaje", 0);
                                                                    actualizarItemCotizacion(item.id, "porcentaje", 0);
                                                                }}
                                                                style={{ padding: '0 6px', fontSize: '0.75rem', background: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '6px', cursor: 'pointer', height: '32px' }}
                                                                title="Quitar porcentaje"
                                                            >✕</button>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                                            <input type="number" className="input-presupuesto" style={{ width: '60px', fontSize: '0.85rem' }} value={item.porcentaje} onChange={e => actualizarItemCotizacion(item.id, "porcentaje", Number(e.target.value))} placeholder="%" />
                                                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>%</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => actualizarItemCotizacion(item.id, "porcentaje", 1)}
                                                        style={{ fontSize: '0.75rem', padding: '2px 8px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ddd', background: '#f8f9fa' }}
                                                    >+ %</button>
                                                )
                                            ) : (
                                                (item.porcentaje > 0 || item.montoPorcentaje > 0) ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontWeight: 600 }}>$ {((item.montoPorcentaje * item.porcentaje) / 100).toLocaleString()}</span>
                                                        <small style={{ color: '#888', fontSize: '0.7rem' }}>{item.porcentaje}% de {item.montoPorcentaje.toLocaleString()}</small>
                                                    </div>
                                                ) : "-"
                                            )}
                                        </td>
                                    )}
                                    <td>$ {item.totalItem.toLocaleString()}</td>
                                    {modoEdicion && <td><button className="btn-counter" style={{ color: '#c62828' }} onClick={() => eliminarItemCotizacion(item.id)}>✕</button></td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="resumen-presupuesto-grid">
                        <div className="presupuesto-col-izq">
                            <div className="cuotas-seccion-bloque" style={{ marginTop: '20px', padding: '15px', background: '#f0f4f8', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <strong style={{ color: 'var(--principal)' }}>Plan de Cuotas</strong>
                                    {modoEdicion && (
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <input type="number" style={{ width: '50px' }} value={datosEditSeccion.cotizacion.cantidadCuotas} onChange={e => regenerarCuotas(Number(e.target.value), datosEditSeccion.cotizacion.cuotasIguales)} />
                                            <label style={{ fontSize: '0.8rem', cursor: 'pointer', display: 'flex', gap: '4px' }}>
                                                <input type="checkbox" checked={datosEditSeccion.cotizacion.cuotasIguales} onChange={e => regenerarCuotas(datosEditSeccion.cotizacion.cantidadCuotas, e.target.checked)} />
                                                Iguales
                                            </label>
                                        </div>
                                    )}
                                </div>

                                <div className="cuotas-lista-scroll" style={{ maxHeight: '150px', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
                                    {((modoEdicion ? datosEditSeccion : expediente).cotizacion.cuotas || []).map((c: any) => (
                                        <div key={c.numero} style={{ background: 'white', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.85rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span>Cuota {c.numero}</span>
                                                {!modoEdicion && (
                                                    <span style={{
                                                        fontSize: '0.7rem',
                                                        fontWeight: 'bold',
                                                        color: c.pagado ? '#2e7d32' : '#c62828',
                                                        background: c.pagado ? '#e8f5e9' : '#ffebee',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px'
                                                    }}>
                                                        {c.pagado ? 'Pagado' : 'No pagado'}
                                                    </span>
                                                )}
                                            </div>
                                            {modoEdicion ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                                                    <input type="number" className="input-presupuesto" style={{ width: '100%' }} value={c.monto} onChange={e => handleCuotaChange(c.numero, "monto", Number(e.target.value))} disabled={datosEditSeccion.cotizacion.cuotasIguales} />
                                                    <label style={{ fontSize: '0.75rem', display: 'flex', gap: '4px', cursor: 'pointer', alignItems: 'center' }}>
                                                        <input type="checkbox" checked={c.pagado} onChange={e => handleCuotaChange(c.numero, "pagado", e.target.checked)} />
                                                        Marcar como Pagado
                                                    </label>
                                                </div>
                                            ) : (
                                                <div style={{ fontWeight: 'bold', marginTop: '4px', fontSize: '1rem' }}>$ {c.monto.toLocaleString()}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="presupuesto-col-der">
                            <div className="fila-resumen">
                                <span>Total Honorarios:</span>
                                <strong>$ {totalServiciosActual.toLocaleString()}</strong>
                            </div>
                            <div className="fila-resumen">
                                <span>Seña Recibida:</span>
                                {modoEdicion ?
                                    <input type="number" style={{ width: '120px', textAlign: 'right' }} value={datosEditSeccion.cotizacion.senas} onChange={e => handleChangeSeccion("cotizacion", { ...datosEditSeccion.cotizacion, senas: Number(e.target.value) })} /> :
                                    <span>$ {expediente.cotizacion.senas.toLocaleString()}</span>
                                }
                            </div>
                            <div className="total-fila" style={{ marginTop: '15px', paddingTop: '15px', borderTop: '2px dashed #ddd', background: 'var(--principal)', color: 'white' }}>
                                <span>SALDO A PAGAR:</span>
                                <span style={{ fontSize: '1.4rem' }}>$ {saldoPendienteActual.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN: RELEVAMIENTO (NUEVO) */}
            <div className="secciones-contenedor-full relevamiento-seccion" style={{ marginTop: '40px' }}>
                <div className="seccion-header-con-boton">
                    <h2 style={{ fontSize: "1.5rem", color: "var(--principal)", margin: 0 }}>Relevamiento y Campo</h2>
                </div>
                <div className="tarjeta-detalle" style={{ marginTop: '20px', position: 'relative' }}>

                    <table className="tabla-presupuesto">
                        <thead>
                            <tr>
                                <th style={{ width: '50%' }}>Descripción del Servicio</th>
                                <th>Fecha de Realización</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(modoEdicion ? datosEditSeccion : expediente).cotizacion.items.map((item: any) => (
                                <tr key={item.id}>
                                    <td style={{ fontWeight: 600 }}>{item.nombre}</td>
                                    <td>
                                        {modoEdicion ? (
                                            <input
                                                type="date"
                                                className="expedientes-input"
                                                value={item.fechaRealizacion || ""}
                                                onChange={e => {
                                                    actualizarItemCotizacion(item.id, "fechaRealizacion", e.target.value);
                                                }}
                                            />
                                        ) : (
                                            <span>{item.fechaRealizacion ? formatDate(item.fechaRealizacion) : "Pendiente"}</span>
                                        )}
                                    </td>
                                    <td>
                                        {modoEdicion ? (
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={!!item.realizado}
                                                    onChange={e => {
                                                        const nuevosItems = datosEditSeccion.cotizacion.items.map((i: any) =>
                                                            i.id === item.id ? { ...i, realizado: e.target.checked } : i
                                                        );
                                                        setDatosEditSeccion({
                                                            ...datosEditSeccion,
                                                            cotizacion: { ...datosEditSeccion.cotizacion, items: nuevosItems }
                                                        });
                                                    }}
                                                />
                                                {item.realizado ? "Hecho" : "Pendiente"}
                                            </label>
                                        ) : (
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                background: item.realizado ? '#e8f5e9' : '#f5f5f5',
                                                color: item.realizado ? '#2e7d32' : '#666'
                                            }}>
                                                {item.realizado ? "✓ COMPLETADO" : "PENDIENTE"}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ marginTop: '24px' }}>
                        <label className="dato-label" style={{ display: 'block', marginBottom: '8px' }}>Observaciones del Relevamiento</label>
                        {modoEdicion ? (
                            <textarea
                                className="expedientes-input"
                                value={datosEditSeccion.notas_relevamiento || ""}
                                onChange={e => handleChangeSeccion("notas_relevamiento", e.target.value)}
                                style={{ width: '100%', minHeight: '100px' }}
                                placeholder="Escribir observaciones sobre el trabajo de campo..."
                            />
                        ) : (
                            <div style={{
                                padding: '15px',
                                background: '#fcfcfc',
                                borderRadius: '10px',
                                border: '1px solid #eee',
                                minHeight: '60px',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {expediente.notas_relevamiento || "Sin observaciones registradas."}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL PARA EDITAR PRESUPUESTO ANTES DE GENERAR DOCX */}
            {
                showBudgetModal && (
                    <div className="overlay-modal" onClick={() => setShowBudgetModal(false)}>
                        <div className="modal-presupuesto" onClick={e => e.stopPropagation()}>
                            <h2>Pre-visualizar Presupuesto</h2>
                            <div className="grid-edicion-pdf">
                                <div className="campo-edicion">
                                    <label>Nombre del Cliente</label>
                                    <input type="text" value={budgetDataOverriden.nombre_cliente} onChange={e => setBudgetDataOverriden({ ...budgetDataOverriden, nombre_cliente: e.target.value })} />
                                </div>
                                <div className="campo-edicion">
                                    <label>Objeto del Trabajo</label>
                                    <input type="text" value={budgetDataOverriden.objeto} onChange={e => setBudgetDataOverriden({ ...budgetDataOverriden, objeto: e.target.value })} />
                                </div>
                                <div className="campo-edicion">
                                    <label>Departamento (Dep)</label>
                                    <input type="text" value={budgetDataOverriden.depto} onChange={e => setBudgetDataOverriden({ ...budgetDataOverriden, depto: e.target.value })} />
                                </div>
                                <div className="campo-edicion">
                                    <label>Municipio (Mun)</label>
                                    <input type="text" value={budgetDataOverriden.municipio} onChange={e => setBudgetDataOverriden({ ...budgetDataOverriden, municipio: e.target.value })} />
                                </div>
                                <div className="campo-edicion">
                                    <label>Sección (Secc)</label>
                                    <input type="text" value={budgetDataOverriden.seccion} onChange={e => setBudgetDataOverriden({ ...budgetDataOverriden, seccion: e.target.value })} />
                                </div>
                                <div className="campo-edicion">
                                    <label>Chacra (Chac)</label>
                                    <input type="text" value={budgetDataOverriden.chacra} onChange={e => setBudgetDataOverriden({ ...budgetDataOverriden, chacra: e.target.value })} />
                                </div>
                                <div className="campo-edicion">
                                    <label>Manzana (Mz)</label>
                                    <input type="text" value={budgetDataOverriden.manzana} onChange={e => setBudgetDataOverriden({ ...budgetDataOverriden, manzana: e.target.value })} />
                                </div>
                                <div className="campo-edicion">
                                    <label>Parcela (Parc)</label>
                                    <input type="text" value={budgetDataOverriden.parcela} onChange={e => setBudgetDataOverriden({ ...budgetDataOverriden, parcela: e.target.value })} />
                                </div>
                                <div className="campo-edicion">
                                    <label>Honorarios más Gastos</label>
                                    <input type="text" value={budgetDataOverriden.total_honorarios} onChange={e => setBudgetDataOverriden({ ...budgetDataOverriden, total_honorarios: e.target.value })} />
                                </div>
                                <div className="campo-edicion">
                                    <label>Tiempo de Ejecución</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                            type="number"
                                            style={{ width: '80px' }}
                                            value={budgetDataOverriden.tiempo_ejecucion}
                                            onChange={e => setBudgetDataOverriden({ ...budgetDataOverriden, tiempo_ejecucion: e.target.value })}
                                        />
                                        <span style={{ fontSize: '0.9rem', color: '#666' }}>días aprox.</span>
                                    </div>
                                </div>
                                <div className="campo-edicion" style={{ gridColumn: 'span 2' }}>
                                    <label>Forma de Pago Propuesta</label>
                                    <textarea value={budgetDataOverriden.cuotas_resumen} onChange={e => setBudgetDataOverriden({ ...budgetDataOverriden, cuotas_resumen: e.target.value })} />
                                </div>
                                <div className="campo-edicion" style={{ gridColumn: 'span 2' }}>
                                    <label>Requisitos</label>
                                    <textarea value={budgetDataOverriden.requisitos} onChange={e => setBudgetDataOverriden({ ...budgetDataOverriden, requisitos: e.target.value })} />
                                </div>
                            </div>
                            <div className="modal-acciones">
                                <button className="expedientes-boton expedientes-boton-secundario" onClick={() => setShowBudgetModal(false)}>Cancelar</button>
                                <button className="expedientes-boton" onClick={descargarPresupuestoPersonalizado}>Generar y Descargar Word</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* MODAL PARA PREVISUALIZAR FICHA FORMAL (TEXTO) */}
            {showFichaModal && (
                <div className="overlay-modal ficha-modal-overlay" onClick={() => setShowFichaModal(false)}>
                    <div className="modal-presupuesto" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '12px', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>Vista Previa de Ficha Formal</h2>
                            <div className="no-print" style={{ display: 'flex', gap: '10px' }}>
                                <button className="expedientes-boton expedientes-boton-secundario" onClick={() => setShowFichaModal(false)}>Cerrar</button>
                                <button className="expedientes-boton" style={{ background: "#e1f5fe", color: "#0288d1" }} onClick={descargarFichaPDF}>Descargar PDF (Archivo)</button>
                                <button className="expedientes-boton expedientes-boton-principal" onClick={() => window.print()}>Imprimir Directo</button>
                            </div>
                        </div>

                        <div className="ficha-preview-content document-paper">
                            <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
                                <h1 style={{ margin: 0, textTransform: 'uppercase', fontSize: '22px' }}>Ficha de Expediente #{expediente.numero}</h1>
                                <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{expediente.objeto || "Sin Objeto"}</p>
                            </div>

                            <div className="ficha-print-section">
                                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', textTransform: 'uppercase', fontSize: '16px', marginTop: '20px' }}>Datos Generales del Proyecto</h3>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li><strong>Objeto:</strong> {expediente.objeto || "-"}</li>
                                    <li><strong>Titular / Cliente:</strong> {expediente.cliente}</li>
                                    <li><strong>Responsable:</strong> {expediente.responsable || "-"}</li>
                                    <li><strong>Fecha Apertura:</strong> {expediente.fechas.creado}</li>
                                    <li><strong>Estado Actual:</strong> {expediente.estado}</li>
                                </ul>

                                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', textTransform: 'uppercase', fontSize: '16px', marginTop: '20px' }}>Ubicación y Terreno</h3>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li><strong>Designación:</strong> {expediente.terreno || "-"}</li>
                                    <li><strong>Dirección:</strong> {expediente.ubicacion || "-"}</li>
                                    <li><strong>Coordenadas:</strong> Lat: {expediente.coords?.[0]?.toFixed(6) || "-"}, Lng: {expediente.coords?.[1]?.toFixed(6) || "-"}</li>
                                </ul>

                                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', textTransform: 'uppercase', fontSize: '16px', marginTop: '20px' }}>Nomenclatura Catastral</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        <li><strong>Departamento:</strong> {expediente.depto || "-"}</li>
                                        <li><strong>Municipio:</strong> {expediente.municipio || "-"}</li>
                                        <li><strong>Sección:</strong> {expediente.seccion || "-"}</li>
                                        <li><strong>Chacra:</strong> {expediente.chacra || "-"}</li>
                                    </ul>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        <li><strong>Manzana:</strong> {expediente.manzana || "-"}</li>
                                        <li><strong>Parcela:</strong> {expediente.parcela || "-"}</li>
                                        <li><strong>Lote:</strong> {expediente.lote || "-"}</li>
                                        <li><strong>Partida Inmobiliaria:</strong> {expediente.partida_inmobiliaria || "-"}</li>
                                    </ul>
                                </div>

                                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', textTransform: 'uppercase', fontSize: '16px', marginTop: '20px' }}>Trámite Catastro (DGC)</h3>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li><strong>Número de Expediente:</strong> {expediente.expediente_n || "-"}</li>
                                    <li><strong>Presentación DGC:</strong> {expediente.fechas.presentacion_dgc}</li>
                                    <li><strong>Previa DGC:</strong> {expediente.fechas.previa_dgc}</li>
                                    <li><strong>Definitiva DGC:</strong> {expediente.fechas.definitiva_dgc}</li>
                                    <li><strong>Visado DGC:</strong> {expediente.fechas.visado}</li>
                                </ul>

                                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', textTransform: 'uppercase', fontSize: '16px', marginTop: '20px' }}>Relevamiento y Campo</h3>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li><strong>Fecha Relevamiento:</strong> {expediente.fechas.relevamiento}</li>
                                    <li><strong>Colocación de Mojones:</strong> {expediente.mojones ? "SÍ" : "NO"} {expediente.fecha_mojones ? `(Fecha: ${formatDate(expediente.fecha_mojones)})` : ""}</li>
                                    <li><strong>Observaciones:</strong> {expediente.notas_relevamiento || "Sin observaciones."}</li>
                                </ul>

                                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', textTransform: 'uppercase', fontSize: '16px', marginTop: '20px' }}>Información del Firmante</h3>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li><strong>Tipo de Firmante:</strong> {expediente.tipo_firmante}</li>
                                    <li><strong>Documentación:</strong></li>
                                    {Object.keys(expediente.checklist_firmante).map(key => {
                                        const labels: any = {
                                            libre_deuda: "Libre Deuda",
                                            dni_titular: "DNI Titular",
                                            dni_poseedor: "DNI Poseedor",
                                            dni_responsable: "DNI Responsable",
                                            escribano: "Escribano",
                                            cuil_empresa: "CUIL Empresa"
                                        };
                                        return (
                                            <li key={key} style={{ marginLeft: '20px', fontSize: '14px' }}>
                                                - {labels[key] || key}: {expediente.checklist_firmante[key] ? "ENTREGADO" : "PENDIENTE"}
                                            </li>
                                        );
                                    })}
                                    <li style={{ marginTop: '10px' }}><strong>Observaciones Doc.:</strong> {expediente.doc_firmante || "-"}</li>
                                </ul>

                                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', textTransform: 'uppercase', fontSize: '16px', marginTop: '20px' }}>Servicios y Presupuesto</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '14px' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #000' }}>
                                            <th style={{ padding: '5px' }}>Servicio</th>
                                            <th style={{ padding: '5px' }}>Estado</th>
                                            <th style={{ padding: '5px', textAlign: 'right' }}>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expediente.cotizacion.items.map((item: any) => (
                                            <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '5px' }}>{item.nombre}</td>
                                                <td style={{ padding: '5px' }}>{item.realizado ? "Realizado" : "Pendiente"}</td>
                                                <td style={{ padding: '5px', textAlign: 'right' }}>$ {item.totalItem.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div style={{ textAlign: 'right', marginTop: '15px', fontWeight: 'bold', fontSize: '16px' }}>
                                    <p>Total Presupuestado: $ {totalServiciosActual.toLocaleString()}</p>
                                    <p>Seña Recibida: $ {expediente.cotizacion.senas.toLocaleString()}</p>
                                    <p style={{ borderTop: '1px solid #000', paddingTop: '5px', display: 'inline-block' }}>SALDO PENDIENTE: $ {saldoPendienteActual.toLocaleString()}</p>
                                </div>

                                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', textTransform: 'uppercase', fontSize: '16px', marginTop: '20px' }}>Notas y Materiales</h3>
                                <p><strong>Materiales:</strong> {expediente.materiales || "-"}</p>
                                <p><strong>Notas Adicionales:</strong> {expediente.notas || "-"}</p>
                            </div>

                            <div style={{ marginTop: '50px', fontSize: '12px', textAlign: 'center', fontStyle: 'italic', color: '#666' }}>
                                Documento generado automáticamente por el Sistema de Gestión de Agrimensura - Fecha: {new Date().toLocaleDateString('es-AR')}
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
}
