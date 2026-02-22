import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/Expedientes.css";
import BarraLateralIzquierda from "./BarraLateralIzquierda";

type Expediente = {
    id: string;
    numero: string;
    cliente: string;
    terreno: string;
    estado: string;
    ultimaActualizacion: string;
};

export default function Expedientes() {
    const navigate = useNavigate();
    const [expedientes, setExpedientes] = useState<Expediente[]>([]);
    const [cargando, setCargando] = useState(true);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState<string>("Todos");
    const [orden, setOrden] = useState<"asc" | "desc">("desc");

    // Cargar datos reales
    useEffect(() => {
        fetch("http://localhost:4000/api/expedientes")
            .then(res => res.json())
            .then(data => {
                setExpedientes(data);
                setCargando(false);
            })
            .catch(err => {
                console.error("Error al cargar expedientes:", err);
                setCargando(false);
            });
    }, []);

    const listaFiltrada = useMemo(() => {
        let filtrados = expedientes.filter(exp => {
            const texto = busqueda.toLowerCase();
            // Buscar en todos los campos disponibles para ser exhaustivos
            const coincideTexto =
                (exp.cliente?.toLowerCase() || "").includes(texto) ||
                (exp.numero?.toLowerCase() || "").includes(texto) ||
                (exp.terreno?.toLowerCase() || "").includes(texto) ||
                (exp.estado?.toLowerCase() || "").includes(texto) ||
                (exp.ultimaActualizacion?.toLowerCase() || "").includes(texto);

            const coincideEstado = filtroEstado === "Todos" || exp.estado === filtroEstado;

            return coincideTexto && coincideEstado;
        });

        // Aplicar orden numérico por ID
        return filtrados.sort((a, b) => {
            const valA = Number(a.id);
            const valB = Number(b.id);
            return orden === "asc"
                ? valA - valB
                : valB - valA;
        });
    }, [busqueda, filtroEstado, orden, expedientes]);

    const irADetalle = (id: string) => {
        navigate(`/expedientes/detalle/${id}`);
    };

    const getClaseEstado = (estado: string) => {
        switch (estado) {
            case "Finalizado": return "estado-finalizado";
            case "En Proceso":
            default: return "estado-en-proceso";
        }
    };

    return (
        <div className="expedientes-pagina">
            <header className="expedientes-header">
                <div className="expedientes-header-izquierda">
                    <button
                        className="boton-menu-unificado"
                        type="button"
                        onClick={() => setMenuAbierto(true)}
                        aria-label="Abrir menú"
                    >
                        ☰
                    </button>
                    <div>
                        <h1 className="expedientes-h1">Expedientes</h1>
                        <p className="expedientes-descripcion">Gestión y seguimiento de trámites.</p>
                    </div>
                </div>

                <div>
                    <button className="expedientes-boton expedientes-boton-principal" onClick={() => navigate("/expedientes/crear")}>
                        + Crear Expediente
                    </button>
                </div>
            </header>

            <section className="expedientes-seccion">
                <div className="expedientes-barra-busqueda">
                    <div className="busqueda-grupo">
                        <input
                            type="text"
                            className="expedientes-input expedientes-input-busqueda"
                            placeholder="Buscar por cliente, terreno, número, fecha..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                        <select
                            className="expedientes-select-orden"
                            value={orden}
                            onChange={(e) => setOrden(e.target.value as "asc" | "desc")}
                        >
                            <option value="desc">Más recientes primero (Desc)</option>
                            <option value="asc">Más antiguos primero (Asc)</option>
                        </select>
                    </div>
                </div>

                <div className="expedientes-filtros">
                    {["Todos", "En Proceso", "Finalizado"].map(estado => (
                        <button
                            key={estado}
                            className={`expedientes-chip-filtro ${filtroEstado === estado ? "activo" : ""}`}
                            onClick={() => setFiltroEstado(estado)}
                        >
                            {estado}
                        </button>
                    ))}
                </div>

                <div className="expedientes-tabla-contenedor">
                    <table className="expedientes-tabla">
                        <thead>
                            <tr>
                                <th>Número</th>
                                <th>Cliente</th>
                                <th>Terreno</th>
                                <th>Estado</th>
                                <th>Plan Visado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cargando ? (
                                <tr><td colSpan={6} style={{ textAlign: "center", padding: "30px" }}>Cargando expedientes...</td></tr>
                            ) : listaFiltrada.length > 0 ? (
                                listaFiltrada.map(exp => (
                                    <tr key={exp.id}>
                                        <td data-label="Número"><strong>{exp.numero}</strong></td>
                                        <td data-label="Cliente">{exp.cliente}</td>
                                        <td data-label="Terreno">{exp.terreno}</td>
                                        <td data-label="Estado">
                                            <span className={`estado-badge ${getClaseEstado(exp.estado)}`}>
                                                {exp.estado}
                                            </span>
                                        </td>
                                        <td data-label="Visado">{exp.ultimaActualizacion}</td>
                                        <td data-label="Acciones">
                                            <div className="expedientes-acciones-tabla">
                                                <button className="btn-icon" onClick={() => irADetalle(exp.id)} title="Ver detalle">
                                                    Ver
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: "center", padding: "30px" }}>
                                        No se encontraron expedientes.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <BarraLateralIzquierda abierto={menuAbierto} alCerrar={() => setMenuAbierto(false)} />
        </div>
    );
}
