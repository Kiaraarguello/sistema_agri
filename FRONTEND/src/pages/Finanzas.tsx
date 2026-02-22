import { useState, useEffect, useRef } from "react";
import BarraLateralIzquierda from "./BarraLateralIzquierda";
import "../estilos/Finanzas.css";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Legend, LineChart, Line
} from 'recharts';
import {
    TrendingUp, DollarSign, Clock, CheckCircle, Menu, Receipt, AlertCircle
} from 'lucide-react';
import { apiFetch } from "../utils/api";

type FinanzasData = {
    kpis: {
        totalFacturado: number;
        totalCobrado: number;
        totalPendiente: number;
        porcentajeCobrado: number;
    };
    graficos: {
        cobranzaMensual: { mes: string; monto: number; cantidad_pagos: number }[];
        serviciosRentables: { nombre: string; cantidad: number; total: number }[];
        deudores: { cliente: string; saldo_pendiente: number; cuotas_pendientes: number }[];
        mejoresClientes: { cliente: string; total_pagado: number }[];
    };
    ultimosCobros: { cliente: string; monto: number; fecha: string; cuota_n: number }[];
};

export default function Finanzas() {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [datos, setDatos] = useState<FinanzasData | null>(null);
    const [periodo, setPeriodo] = useState('all');

    const contenedorRef = useRef<HTMLDivElement | null>(null);
    const [mouse, setMouse] = useState({ x: 50, y: 50 });

    useEffect(() => {
        cargarDatos();
    }, [periodo]);

    const cargarDatos = async () => {
        setCargando(true);
        try {
            // Usamos apiFetch para consistencia con el resto del proyecto
            const res = await apiFetch(`http://localhost:4000/api/finanzas/estadisticas?periodo=${periodo}&_t=${Date.now()}`);
            const data = await res.json();
            setDatos(data);
        } catch (error) {
            console.error("Error al cargar datos financieros:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            if (!contenedorRef.current) return;
            const rect = contenedorRef.current.getBoundingClientRect();
            setMouse({
                x: Math.max(0, Math.min(100, ((e.clientX - rect.left) / (rect.width || 1)) * 100)),
                y: Math.max(0, Math.min(100, ((e.clientY - rect.top) / (rect.height || 1)) * 100)),
            });
        };
        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, []);

    if (cargando && !datos) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#213B21', background: '#fbf7f1' }}>
                <div style={{ textAlign: 'center' }}>
                    <h3>Cargando Informe de Cobros...</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Por favor, espere un momento.</p>
                </div>
            </div>
        );
    }

    // Si no hay datos después de cargar, mostrar un mensaje de error o vacío en lugar de blanco
    if (!datos && !cargando) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '20px' }}>
                <h3>Error al conectar con el servidor de finanzas</h3>
                <button className="boton-principal" onClick={() => window.location.reload()}>Reintentar</button>
            </div>
        );
    }

    return (
        <div
            ref={contenedorRef}
            className="finanzas-pagina"
            style={{ "--mx": `${mouse.x}%`, "--my": `${mouse.y}%` } as any}
        >
            <BarraLateralIzquierda abierto={menuAbierto} alCerrar={() => setMenuAbierto(false)} />

            <header className="finanzas-header">
                <div className="finanzas-header-izquierda">
                    <button className="boton-menu-unificado" onClick={() => setMenuAbierto(true)}>
                        <Menu size={24} />
                    </button>
                    <div className="finanzas-titulo-seccion">
                        <h1>Panel de Cobranzas</h1>
                        <p>Seguimiento detallado de ingresos, deuda activa y deudores.</p>
                    </div>
                </div>

                <div className="finanzas-filtros">
                    <button
                        onClick={cargarDatos}
                        className="btn-icono-solo"
                        title="Actualizar Datos"
                        style={{ marginRight: '10px', background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer' }}
                    >
                        <TrendingUp size={18} />
                    </button>
                    <select
                        value={periodo}
                        onChange={(e) => setPeriodo(e.target.value)}
                        className="select-premium"
                    >
                        <option value="month">Este Mes</option>
                        <option value="year">Año Actual</option>
                        <option value="all">Todo el Historial</option>
                    </select>
                </div>
            </header>

            {datos && (
                <>
                    {/* KPIs */}
                    <div className="finanzas-kpi-grid">
                        <div className="finanzas-kpi-card kpi-cobrado">
                            <div className="finanzas-kpi-icono">
                                <DollarSign size={24} />
                            </div>
                            <span className="finanzas-kpi-label">Ingresos Percibidos</span>
                            <span className="finanzas-kpi-valor">${(datos.kpis.totalCobrado || 0).toLocaleString()}</span>
                            <span className="finanzas-kpi-sub">Total de dinero en caja</span>
                        </div>

                        <div className="finanzas-kpi-card kpi-pendiente">
                            <div className="finanzas-kpi-icono">
                                <Clock size={24} />
                            </div>
                            <span className="finanzas-kpi-label">Pendiente de Cobro</span>
                            <span className="finanzas-kpi-valor">${(datos.kpis.totalPendiente || 0).toLocaleString()}</span>
                            <span className="finanzas-kpi-sub">Deuda total de clientes</span>
                        </div>

                        <div className="finanzas-kpi-card kpi-facturado">
                            <div className="finanzas-kpi-icono">
                                <Receipt size={24} />
                            </div>
                            <span className="finanzas-kpi-label">Total Comprometido</span>
                            <span className="finanzas-kpi-valor">${(datos.kpis.totalFacturado || 0).toLocaleString()}</span>
                            <span className="finanzas-kpi-sub">Suma de todos los presupuestos</span>
                        </div>

                        <div className="finanzas-kpi-card kpi-efectividad">
                            <div className="finanzas-kpi-icono">
                                <TrendingUp size={24} />
                            </div>
                            <span className="finanzas-kpi-label">Efectividad de Cobro</span>
                            <span className="finanzas-kpi-valor">{(datos.kpis.porcentajeCobrado || 0).toFixed(1)}%</span>
                            <span className="finanzas-kpi-sub">Ratio Cobrado vs Comprometido</span>
                        </div>
                    </div>

                    <div className="finanzas-charts-grid">
                        <div className="finanzas-chart-card">
                            <h3>Evolución de Cobranzas Mensuales</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={datos.graficos.cobranzaMensual || []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} tickFormatter={(value) => `$${value / 1000}Mil`} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                        formatter={(value: any) => [`$${Number(value || 0).toLocaleString()}`, 'Cobrado']}
                                    />
                                    <Legend verticalAlign="top" height={36} />
                                    <Line name="Monto Cobrado" type="monotone" dataKey="monto" stroke="#4CAF50" strokeWidth={3} dot={{ r: 6, fill: '#4CAF50' }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="finanzas-chart-card">
                            <h3>Distribución de Deuda por Cliente (Top 10)</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={datos.graficos.deudores || []} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="cliente" type="category" width={120} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#333' }} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                        contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                        formatter={(value: any) => [`$${Number(value || 0).toLocaleString()}`, 'Saldo Pendiente']}
                                    />
                                    <Bar dataKey="saldo_pendiente" fill="#c62828" radius={[0, 10, 10, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="finanzas-charts-grid">
                        <div className="finanzas-tabla-seccion" style={{ gridColumn: 'span 1' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <CheckCircle size={20} color="#2e7d32" />
                                <h3 style={{ margin: 0 }}>Pagos Recibidos Recientemente</h3>
                            </div>
                            <div className="tabla-contenedor">
                                <table className="tabla">
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Cliente</th>
                                            <th>Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(datos.ultimosCobros || []).slice(0, 10).map((c, i) => (
                                            <tr key={i}>
                                                <td data-label="Fecha" style={{ fontSize: '0.9rem', color: '#666' }}>{c.fecha}</td>
                                                <td data-label="Cliente" style={{ fontWeight: 600 }}>{c.cliente}</td>
                                                <td data-label="Monto" style={{ color: '#2e7d32', fontWeight: 800 }}>+ ${(c.monto || 0).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                        {(!datos.ultimosCobros || datos.ultimosCobros.length === 0) && (
                                            <tr><td colSpan={3} style={{ textAlign: 'center', padding: '20px', color: '#999' }}>No hay cobros registrados recientemente.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="finanzas-tabla-seccion" style={{ gridColumn: 'span 1' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <AlertCircle size={20} color="#c62828" />
                                <h3 style={{ margin: 0 }}>Principales Deudores</h3>
                            </div>
                            <div className="tabla-contenedor">
                                <table className="tabla">
                                    <thead>
                                        <tr>
                                            <th>Cliente</th>
                                            <th>Cuotas</th>
                                            <th>Saldo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(datos.graficos.deudores || []).map((d, i) => (
                                            <tr key={i}>
                                                <td data-label="Cliente" style={{ fontWeight: 600 }}>{d.cliente}</td>
                                                <td data-label="Cuotas">{d.cuotas_pendientes} pend.</td>
                                                <td data-label="Saldo" style={{ color: '#c62828', fontWeight: 800 }}>${(d.saldo_pendiente || 0).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                        {(!datos.graficos.deudores || datos.graficos.deudores.length === 0) && (
                                            <tr><td colSpan={3} style={{ textAlign: 'center', padding: '20px', color: '#999' }}>No hay deudores activos. ¡Excelente!</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="finanzas-charts-grid">
                        <div className="finanzas-tabla-seccion" style={{ gridColumn: 'span 2' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <TrendingUp size={20} color="var(--principal)" />
                                <h3 style={{ margin: 0 }}>Ranking de Clientes (Mayor Inversión Total)</h3>
                            </div>
                            <div className="tabla-contenedor">
                                <table className="tabla">
                                    <thead>
                                        <tr>
                                            <th>Cliente</th>
                                            <th>Total Pagado (Histórico)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(datos.graficos.mejoresClientes || []).map((m, i) => (
                                            <tr key={i}>
                                                <td data-label="Cliente" style={{ fontWeight: 600 }}>{m.cliente}</td>
                                                <td data-label="Total Pagado" style={{ color: 'var(--principal)', fontWeight: 800 }}>${(m.total_pagado || 0).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
