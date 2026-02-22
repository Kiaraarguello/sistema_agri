import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../estilos/Landing.css";
// Imagenes importadas (si no existen, se usan placeholders o se ocultan con error fallback en onError)
// Asumiremos que el usuario pondra las imagenes en public/img/landing/ segun el doc

export default function Landing() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Scroll suave a secciones
    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="landing-page">
            {/* Navbar */}
            <nav className={`landing-navbar ${scrolled ? 'scrolled' : ''}`}>
                <a href="#" className="landing-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src="/imagenes_landing/logo_mensu.png" alt="Mensú Logo" style={{ height: '40px', width: 'auto' }} />
                    Mensú
                </a>
                <div className="landing-links">
                    <a href="#inicio" onClick={(e) => { e.preventDefault(); scrollTo('inicio'); }} className="landing-link">Inicio</a>
                    <a href="#features" onClick={(e) => { e.preventDefault(); scrollTo('features'); }} className="landing-link">Funciones</a>
                    <a href="#showcase" onClick={(e) => { e.preventDefault(); scrollTo('showcase'); }} className="landing-link">Galería</a>
                    <a href="#stats" onClick={(e) => { e.preventDefault(); scrollTo('stats'); }} className="landing-link">Impacto</a>
                </div>
                <Link to="/login" className="btn-login-landing">
                    <span>Acceder</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
                </Link>
            </nav>

            {/* Hero Section */}
            <section id="inicio" className="hero-section">
                <div className="bg-shape shape-1" />
                <div className="bg-shape shape-2" />

                <div className="hero-content">
                    <h1 className="hero-title">
                        Gestión Integral para <br />
                        <span style={{ color: 'var(--principal)' }}>Agrimensura Moderna</span>
                    </h1>
                    <p className="hero-subtitle">
                        Simplifica tu trabajo, organiza tus expedientes y profesionaliza la relación con tus clientes.
                        Todo lo que necesitás, en una sola plataforma diseñada por expertos.
                    </p>
                    <div className="hero-buttons">
                        <button onClick={() => scrollTo('features')} className="btn-secondary">Saber Más</button>
                    </div>

                    {/* Mockup Flotante Central (Placeholder si no imagen) */}
                    <div style={{ marginTop: '4rem', position: 'relative' }}>
                        <img
                            src="/imagenes_landing/mockup-dashboard.png"
                            alt="Dashboard Preview"
                            style={{
                                width: '100%',
                                maxWidth: '900px',
                                borderRadius: '20px',
                                boxShadow: '0 30px 80px rgba(33,59,33,0.15)',
                                border: '1px solid rgba(0,0,0,0.05)',
                                background: '#fff' // Fallback color
                            }}
                            onError={(e) => {
                                e.currentTarget.src = "https://placehold.co/1200x700/eeeeee/213B21?text=Dashboard+Mensú";
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="features-section">
                <div className="section-header">
                    <h2 className="section-title">Potencia tu Estudio</h2>
                    <p className="section-desc">Herramientas pensadas para resolver los problemas reales del día a día.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card feature-expedientes">
                        <div className="feature-icon" style={{ fontSize: '1.5rem', fontWeight: 600 }}>EXP</div>
                        <h3 className="feature-title">Expedientes Digitales</h3>
                        <p className="feature-text">Olvidate de las carpetas físicas perdidas. Seguimiento detallado de Catastro, Municipalidad y más, todo en la nube.</p>
                    </div>
                    <div className="feature-card feature-presupuestos">
                        <div className="feature-icon" style={{ fontSize: '1.5rem', fontWeight: 600 }}>$</div>
                        <h3 className="feature-title">Presupuestos Claros</h3>
                        <p className="feature-text">Generá cotizaciones profesionales en segundos. Calculá honorarios, cuotas y anticipos automáticamente.</p>
                    </div>
                    <div className="feature-card feature-alertas">
                        <div className="feature-icon" style={{ fontSize: '1.5rem', fontWeight: 600 }}>!</div>
                        <h3 className="feature-title">Alertas Inteligentes</h3>
                        <p className="feature-text">Nunca más se te pasará un vencimiento. El sistema te avisa de fechas importantes y tareas pendientes.</p>
                    </div>
                    <div className="feature-card feature-portal">
                        <div className="feature-icon" style={{ fontSize: '1.5rem', fontWeight: 600 }}>CLI</div>
                        <h3 className="feature-title">Portal de Clientes</h3>
                        <p className="feature-text">Dales acceso a tus clientes para que vean el avance de su trámite. Transparencia que genera confianza.</p>
                    </div>
                    <div className="feature-card feature-geo">
                        <div className="feature-icon" style={{ fontSize: '1.5rem', fontWeight: 600 }}>GEO</div>
                        <h3 className="feature-title">Georreferenciación</h3>
                        <p className="feature-text">Vincula tus trabajos con coordenadas reales. Visualizá todos tus proyectos en un mapa interactivo.</p>
                    </div>
                    <div className="feature-card feature-movil">
                        <div className="feature-icon" style={{ fontSize: '1.5rem', fontWeight: 600 }}>MOV</div>
                        <h3 className="feature-title">Acceso Móvil</h3>
                        <p className="feature-text">Llevá tu oficina al campo. Accedé a datos clave desde tu celular o tablet en cualquier lugar.</p>
                    </div>
                </div>
            </section>

            {/* Showcase Section (Alternating) */}
            <section id="showcase" className="showcase-section">
                <div className="showcase-grid">
                    {/* Item 1: Finanzas */}
                    <div className="showcase-item">
                        <div className="showcase-text">
                            <h3 className="showcase-title">Control Total de tus Finanzas</h3>
                            <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '1.5rem' }}>
                                Mantené la salud de tu estudio con una gestión impecable. El sistema centraliza cobros, saldos y deudores,
                                dándote la tranquilidad de saber que ningún honorario quedará sin cobrar.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: 'var(--principal)', fontWeight: 'bold' }}>✓</span> <strong>Cobranza Inteligente:</strong> Seguimiento automático de cuotas y anticipos.</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: 'var(--principal)', fontWeight: 'bold' }}>✓</span> <strong>Visión Estratégica:</strong> Ranking de clientes y KPIs de efectividad mensual.</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: 'var(--principal)', fontWeight: 'bold' }}>✓</span> <strong>Cuentas Claras:</strong> Visualizá la deuda total de tu cartera de un solo vistazo.</li>
                            </ul>
                        </div>
                        <div className="showcase-img-container">
                            <img
                                src="/imagenes_landing/finanzas.png"
                                className="showcase-img"
                                alt="Dashboard Financiero"
                                onError={(e) => { e.currentTarget.src = "https://placehold.co/800x600/f1f8e9/213B21?text=Modulo+Finanzas"; }}
                            />
                        </div>
                    </div>

                    {/* Item 2: Expediente (Reverse) */}
                    <div className="showcase-item reverse">
                        <div className="showcase-text">
                            <h3 className="showcase-title">Agilidad en el Detalle del Trámite</h3>
                            <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '1.5rem' }}>
                                Optimizá tu tiempo centralizando toda la información técnica y administrativa.
                                Accedé a la nomenclatura, estados de Catastro y Municipalidad sin buscar en carpetas físicas.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: 'var(--principal)', fontWeight: 'bold' }}>✓</span> <strong>Historial Unificado:</strong> Notas de relevamiento y cronología del expediente.</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: 'var(--principal)', fontWeight: 'bold' }}>✓</span> <strong>Seguimiento de Trámites:</strong> Controlá fechas de presentación, previas y finales DGC.</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: 'var(--principal)', fontWeight: 'bold' }}>✓</span> <strong>Documentación Lista:</strong> Vinculación directa con planos y certificados.</li>
                            </ul>
                        </div>
                        <div className="showcase-img-container">
                            <img
                                src="/imagenes_landing/detalle-expediente.png"
                                className="showcase-img"
                                alt="Gestión de Expedientes"
                                onError={(e) => { e.currentTarget.src = "https://placehold.co/800x600/e8f5e9/2e7d32?text=Detalle+Expediente"; }}
                            />
                        </div>
                    </div>

                    {/* Item 3: Calendario */}
                    <div className="showcase-item">
                        <div className="showcase-text">
                            <h3 className="showcase-title">Agenda y Gestión de Tiempo</h3>
                            <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '1.5rem' }}>
                                Un calendario para organizar tus tareas. Coordiná tus salidas al campo,
                                reuniones y entregas finales de forma simple.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: 'var(--principal)', fontWeight: 'bold' }}>✓</span> <strong>Alertas de Vencimiento:</strong> Notificaciones para no olvidar plazos legales.</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: 'var(--principal)', fontWeight: 'bold' }}>✓</span> <strong>Planificación de Relevamientos:</strong> Organizá tu semana de campo de forma visual.</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: 'var(--principal)', fontWeight: 'bold' }}>✓</span> <strong>Vínculo Directo:</strong> Saltá del calendario al expediente con un solo clic.</li>
                            </ul>
                        </div>
                        <div className="showcase-img-container">
                            <img
                                src="/imagenes_landing/calendario.png"
                                className="showcase-img"
                                alt="Calendario Inteligente"
                                onError={(e) => { e.currentTarget.src = "https://placehold.co/800x600/e3f2fd/1565c0?text=Calendario+Inteligente"; }}
                            />
                        </div>
                    </div>

                    {/* Item 4: Presupuesto (Reverse) */}
                    <div className="showcase-item reverse">
                        <div className="showcase-text">
                            <h3 className="showcase-title">Presupuestos que Venden</h3>
                            <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '1.5rem' }}>
                                Profesionalizá tu propuesta comercial. Generá presupuestos detallados en minutos y
                                definí esquemas de pago que queden registrados automáticamente en el sistema.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: 'var(--principal)', fontWeight: 'bold' }}>✓</span> <strong>Generación de Documentos:</strong> Emití presupuestos en PDF con tu logo y estilo.</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: 'var(--principal)', fontWeight: 'bold' }}>✓</span> <strong>Flexibilidad de Cobro:</strong> Configurá planes en cuotas o anticipos fácilmente.</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: 'var(--principal)', fontWeight: 'bold' }}>✓</span> <strong>Control de Ítems:</strong> Desglose detallado de honorarios y gastos operativos.</li>
                            </ul>
                        </div>
                        <div className="showcase-img-container">
                            <img
                                src="/imagenes_landing/presupuesto.png"
                                className="showcase-img"
                                alt="Generador de Presupuestos"
                                onError={(e) => { e.currentTarget.src = "https://placehold.co/800x600/fff3e0/e65100?text=Modulo+Presupuestos"; }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats / Impact */}
            <section id="stats" className="stats-section">
                <div className="section-header" style={{ marginBottom: '3rem' }}>
                    <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>Impacto Inmediato</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)' }}>Lo que logran nuestros usuarios en el primer mes</p>
                </div>
                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-number">40%</div>
                        <div className="stat-label">Menos tiempo en tareas administrativas</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">100%</div>
                        <div className="stat-label">Trazabilidad de expedientes</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">24/7</div>
                        <div className="stat-label">Disponibilidad de la información</div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-links">
                    <a href="#" className="footer-link">Contacto</a>
                    <a href="#" className="footer-link">Términos</a>
                    <a href="#" className="footer-link">Privacidad</a>
                    <Link to="/login" className="footer-link">Acceso Clientes</Link>
                </div>
                <p>&copy; {new Date().getFullYear()} Mensú. Todos los derechos reservados.</p>
                <p style={{ fontSize: '0.8rem', marginTop: '1rem', opacity: 0.5 }}>Desarrollado para profesionales.</p>
            </footer>
        </div>
    );
}
