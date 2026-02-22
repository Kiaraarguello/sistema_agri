import { useState, useEffect, useMemo } from "react";
import BarraLateralIzquierda from "./BarraLateralIzquierda";
import { apiFetch } from "../utils/api";
import "../estilos/Usuarios.css";

type Usuario = {
    id: number;
    username: string;
    nombre: string;
    email: string;
    rol: 'admin' | 'cliente' | 'agrimensor';
    activo: number;
    created_at: string;
    expediente_id?: number;
};

export default function Usuarios() {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [cargando, setCargando] = useState(true);
    const [modalEditar, setModalEditar] = useState<Usuario | null>(null);
    const [modalCrear, setModalCrear] = useState(false);
    const [nuevoUsuario, setNuevoUsuario] = useState({
        username: '',
        password: '',
        nombre: '',
        email: '',
        rol: 'agrimensor' as 'admin' | 'cliente' | 'agrimensor',
        expediente_id: '' as string | number
    });
    const [verPass, setVerPass] = useState(false);
    const [clientesDisp, setClientesDisp] = useState<any[]>([]);
    const [busqueda, setBusqueda] = useState('');

    const usuariosFiltrados = useMemo(() => {
        if (!busqueda) return usuarios;
        const query = busqueda.toLowerCase().trim();
        return usuarios.filter(u =>
            (u.nombre || '').toLowerCase().includes(query) ||
            u.username.toLowerCase().includes(query) ||
            u.id.toString().includes(query) ||
            (u.expediente_id || '').toString().includes(query)
        );
    }, [usuarios, busqueda]);

    const cargarUsuarios = async () => {
        setCargando(true);
        try {
            const res = await apiFetch("/usuarios");
            const data = await res.json();
            setUsuarios(data);
        } catch (error) {
            console.error("Error cargando usuarios:", error);
        } finally {
            setCargando(false);
        }
    };

    const cargarClientes = async () => {
        try {
            const res = await apiFetch("http://localhost:4000/api/usuarios/clientes-disponibles");
            const data = await res.json();
            setClientesDisp(data);
        } catch (error) {
            console.error("Error cargando clientes:", error);
        }
    };

    useEffect(() => {
        cargarUsuarios();
        cargarClientes();
    }, []);

    const handleCrear = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await apiFetch("http://localhost:4000/api/usuarios", {
                method: "POST",
                body: JSON.stringify(nuevoUsuario)
            });
            if (res.ok) {
                setModalCrear(false);
                setNuevoUsuario({ username: '', password: '', nombre: '', email: '', rol: 'agrimensor', expediente_id: '' });
                cargarUsuarios();
            } else {
                const data = await res.json();
                alert(data.mensaje || "Error al crear usuario");
            }
        } catch (error) {
            alert("Error al crear usuario");
        }
    };

    const handleCambiarEstado = async (id: number, nuevoEstado: number) => {
        if (!confirm(`¿Estás seguro de ${nuevoEstado ? 'dar de alta' : 'dar de baja'} a este usuario?`)) return;

        try {
            await apiFetch(`http://localhost:4000/api/usuarios/${id}/estado`, {
                method: "PATCH",
                body: JSON.stringify({ activo: nuevoEstado })
            });
            cargarUsuarios();
        } catch (error) {
            alert("Error al cambiar estado");
        }
    };

    const handleActualizar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!modalEditar) return;

        try {
            await apiFetch(`http://localhost:4000/api/usuarios/${modalEditar.id}`, {
                method: "PUT",
                body: JSON.stringify(modalEditar)
            });
            setModalEditar(null);
            cargarUsuarios();
        } catch (error) {
            alert("Error al actualizar usuario");
        }
    };

    const handleEliminar = async (id: number) => {
        if (!confirm("¿Desea eliminar este usuario para siempre? Esta acción no se puede deshacer.")) return;

        try {
            const res = await apiFetch(`http://localhost:4000/api/usuarios/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                cargarUsuarios();
            } else {
                alert("Error al eliminar usuario");
            }
        } catch (error) {
            alert("Error al eliminar usuario");
        }
    };

    return (
        <div className="usuarios-pagina">
            <BarraLateralIzquierda abierto={menuAbierto} alCerrar={() => setMenuAbierto(false)} />

            <header className="usuarios-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                    <button className="boton-menu-unificado" onClick={() => setMenuAbierto(true)}>☰</button>
                    <h1>Administración de Usuarios</h1>
                </div>
                <button className="btn-nuevo-usuario" onClick={() => setModalCrear(true)}>
                    + Nuevo Usuario
                </button>
            </header>

            <div className="usuarios-busqueda-container">
                <span className="icono-busqueda-u">🔍</span>
                <input
                    type="text"
                    className="input-busqueda-u"
                    placeholder="Buscar por nombre, usuario o ID..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            {cargando ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>Cargando usuarios...</div>
            ) : (
                <div className="usuarios-grid">
                    {usuariosFiltrados.map(u => (
                        <div key={u.id} className={`usuario-card ${u.activo ? '' : 'inactivo'}`}>
                            <div className="usuario-card-header">
                                <div className="usuario-avatar">{u.nombre?.charAt(0) || u.username.charAt(0)}</div>
                                <div className="usuario-info-principal">
                                    <h2>{u.nombre || "Sin nombre"}</h2>
                                    <div className="usuario-username">@{u.username}</div>
                                    {u.expediente_id && <div className="usuario-username" style={{ color: 'var(--principal)', fontWeight: 700 }}>Exp. ID: {u.expediente_id}</div>}
                                </div>
                            </div>

                            <div className="usuario-badges">
                                <span className="badge badge-rol">{u.rol}</span>
                                <span className="badge badge-estado">{u.activo ? 'Activo' : 'Inactivo'}</span>
                            </div>

                            <div className="usuario-detalles">
                                <div className="detalle-fila">
                                    <span className="detalle-label">Email:</span>
                                    <span>{u.email || "No asignado"}</span>
                                </div>
                                <div className="detalle-fila">
                                    <span className="detalle-label">Desde:</span>
                                    <span>{new Date(u.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="usuario-acciones-container">
                                <div className="usuario-acciones">
                                    <button className="btn-accion-usuario btn-editar-u" onClick={() => setModalEditar({ ...u, expediente_id: u.expediente_id || '' } as any)}>
                                        Editar
                                    </button>
                                    {u.activo ? (
                                        <button className="btn-accion-usuario btn-baja-u" onClick={() => handleCambiarEstado(u.id, 0)}>
                                            Baja
                                        </button>
                                    ) : (
                                        <button className="btn-accion-usuario btn-alta-u" onClick={() => handleCambiarEstado(u.id, 1)}>
                                            Alta
                                        </button>
                                    )}
                                    <button className="btn-accion-usuario btn-eliminar-u" onClick={() => handleEliminar(u.id)}>
                                        Eliminar
                                    </button>
                                </div>
                                {u.rol === 'cliente' && (
                                    u.expediente_id ? (
                                        <button
                                            className="btn-ver-portal"
                                            onClick={() => window.open(`/portal-cliente/${u.expediente_id}`, '_blank')}
                                        >
                                            Ver información (Portal Cliente)
                                        </button>
                                    ) : (
                                        <div style={{ color: '#d32f2f', fontSize: '0.8rem', fontWeight: 700, textAlign: 'center', marginTop: '10px' }}>
                                            ⚠️ Sin Expediente Asignado (Editar para asignar)
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Crear Usuario */}
            {modalCrear && (
                <div className="modal-editar-u-overlay">
                    <div className="modal-editar-u-content">
                        <h3>Crear Nuevo Usuario</h3>
                        <form className="form-edit-u" onSubmit={handleCrear}>
                            <label>
                                Nombre Completo
                                <input
                                    type="text"
                                    placeholder="Ej: Juan Pérez"
                                    value={nuevoUsuario.nombre}
                                    onChange={e => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
                                    required
                                />
                            </label>
                            <label>
                                Nombre de Usuario
                                <input
                                    type="text"
                                    placeholder="Ej: jperez"
                                    value={nuevoUsuario.username}
                                    onChange={e => setNuevoUsuario({ ...nuevoUsuario, username: e.target.value })}
                                    required
                                />
                            </label>
                            <label style={{ position: 'relative' }}>
                                Contraseña
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={verPass ? "text" : "password"}
                                        placeholder="********"
                                        value={nuevoUsuario.password}
                                        onChange={e => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
                                        required
                                        style={{ width: '100%', paddingRight: '45px' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setVerPass(!verPass)}
                                        className="btn-ver-pass-u"
                                    >
                                        {verPass ? "Ocultar" : "Mostrar"}
                                    </button>
                                </div>
                            </label>
                            <label>
                                Email
                                <input
                                    type="email"
                                    placeholder="juan@ejemplo.com"
                                    value={nuevoUsuario.email}
                                    onChange={e => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
                                />
                            </label>
                            <label>
                                Rol del Sistema
                                <select
                                    value={nuevoUsuario.rol}
                                    onChange={e => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value as any })}
                                >
                                    <option value="agrimensor">Agrimensor</option>
                                    <option value="cliente">Cliente (Solo consulta)</option>
                                </select>
                            </label>

                            {nuevoUsuario.rol === 'cliente' && (
                                <label>
                                    Asociar Comitente/Expediente
                                    <select
                                        onChange={e => {
                                            const c = clientesDisp.find(cli => cli.id == e.target.value);
                                            if (c) {
                                                setNuevoUsuario({
                                                    ...nuevoUsuario,
                                                    nombre: c.nombre_completo,
                                                    expediente_id: c.expediente_id
                                                });
                                            }
                                        }}
                                    >
                                        <option value="">-- Seleccionar Comitente --</option>
                                        {clientesDisp.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.nombre_completo} (Exp: {c.expediente_id || 'Sin id'})
                                            </option>
                                        ))}
                                    </select>
                                    <small style={{ marginTop: '5px', color: '#64748b' }}>
                                        Esto completará el nombre y vinculará el proyecto automáticamente.
                                    </small>
                                </label>
                            )}

                            <div className="modal-acciones-u">
                                <button type="button" className="btn-cancelar-u" onClick={() => setModalCrear(false)}>Cancelar</button>
                                <button type="submit" className="btn-principal-u">Crear Usuario</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {modalEditar && (
                <div className="modal-editar-u-overlay">
                    <div className="modal-editar-u-content">
                        <h3>Editar Usuario</h3>
                        <form className="form-edit-u" onSubmit={handleActualizar}>
                            <label>
                                Nombre Completo
                                <input
                                    type="text"
                                    value={modalEditar.nombre}
                                    onChange={e => setModalEditar({ ...modalEditar, nombre: e.target.value })}
                                    required
                                />
                            </label>
                            <label>
                                Email
                                <input
                                    type="email"
                                    value={modalEditar.email || ""}
                                    onChange={e => setModalEditar({ ...modalEditar, email: e.target.value })}
                                />
                            </label>
                            <label>
                                Rol del Sistema
                                <select
                                    value={modalEditar.rol}
                                    onChange={e => setModalEditar({ ...modalEditar, rol: e.target.value as any })}
                                >
                                    <option value="admin">Administrador</option>
                                    <option value="agrimensor">Agrimensor</option>
                                    <option value="cliente">Cliente (Solo consulta)</option>
                                </select>
                            </label>

                            {modalEditar.rol === 'cliente' && (
                                <label>
                                    Asociar Comitente/Expediente
                                    <select
                                        value={clientesDisp.find(cli => cli.nombre_completo === modalEditar.nombre)?.id || ""}
                                        onChange={e => {
                                            const c = clientesDisp.find(cli => cli.id == e.target.value);
                                            if (c) {
                                                setModalEditar({
                                                    ...modalEditar,
                                                    nombre: c.nombre_completo,
                                                    expediente_id: c.expediente_id
                                                });
                                            }
                                        }}
                                    >
                                        <option value="">-- Cambiar Comitente --</option>
                                        {clientesDisp.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.nombre_completo} (Exp: {c.expediente_id || 'Sin id'})
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            )}

                            <div className="modal-acciones-u">
                                <button type="button" className="btn-cancelar-u" onClick={() => setModalEditar(null)}>Cancelar</button>
                                <button type="submit" className="btn-principal-u">Guardar Cambios</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div >
    );
}
