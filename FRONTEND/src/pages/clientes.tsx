// clientes.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../estilos/Clientes.css";
import BarraLateralIzquierda from "./BarraLateralIzquierda";

type Cliente = {
  id: string;
  nombreCompleto: string;
  dniCuil: string;
  telefono: string;
  email: string;
  direccion: string;
  localidad: string;
  provincia: string;
  notas: string;
  fechaAlta: string; // ISO (YYYY-MM-DD)
};

type ModoPagina = "listado" | "crear" | "editar" | "ver";

type FormularioCliente = Omit<Cliente, "id" | "fechaAlta">;

const normalizarTexto = (texto: string) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const validarFormulario = (datos: FormularioCliente) => {
  const errores: Partial<Record<keyof FormularioCliente, string>> = {};

  if (!datos.nombreCompleto.trim()) errores.nombreCompleto = "Ingresá el nombre y apellido.";
  if (!datos.dniCuil.trim()) errores.dniCuil = "Ingresá DNI o CUIL.";
  if (datos.email.trim() && !/^\S+@\S+\.\S+$/.test(datos.email.trim()))
    errores.email = "El email no parece válido.";
  if (datos.telefono.trim() && datos.telefono.trim().length < 6)
    errores.telefono = "El teléfono parece muy corto.";

  return errores;
};

function Boton({
  variante,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variante: "principal" | "secundario" | "peligro" }) {
  const clase =
    variante === "principal"
      ? "clientes-boton clientes-boton-principal"
      : variante === "peligro"
        ? "clientes-boton clientes-boton-peligro"
        : "clientes-boton clientes-boton-secundario";

  return (
    <button {...props} className={`${clase} ${props.className ?? ""}`.trim()}>
      {children}
    </button>
  );
}

function BotonIcono({
  titulo,
  icono,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { titulo: string; icono: "ver" | "editar" | "volver" | "menu" | "imprimir" }) {
  const etiqueta =
    icono === "ver"
      ? "Ver"
      : icono === "editar"
        ? "Editar"
        : icono === "volver"
          ? "Volver"
          : icono === "imprimir"
            ? "Imprimir"
            : "Menú";

  return (
    <button
      {...props}
      type={props.type ?? "button"}
      className={`clientes-boton-icono ${props.className ?? ""}`.trim()}
      aria-label={titulo}
      title={titulo}
    >
      <span className="clientes-boton-icono-texto">{etiqueta}</span>
    </button>
  );
}

function EtiquetaDato({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="clientes-dato">
      <div className="clientes-dato-titulo">{titulo}</div>
      <div className="clientes-dato-valor">{valor || "—"}</div>
    </div>
  );
}

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
    <div className="clientes-modal-overlay" role="dialog" aria-modal="true" aria-label={titulo}>
      <div className="clientes-modal">
        <div className="clientes-modal-titulo">{titulo}</div>
        <div className="clientes-modal-desc">{descripcion}</div>

        <div className="clientes-modal-acciones">
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

function FormularioClientes({
  modo,
  datosIniciales,
  alCancelar,
  alGuardar,
}: {
  modo: "crear" | "editar";
  datosIniciales: FormularioCliente;
  alCancelar: () => void;
  alGuardar: (datos: FormularioCliente) => void;
}) {
  // Bloque: estado de formulario
  const [datos, setDatos] = useState<FormularioCliente>(datosIniciales);
  const [errores, setErrores] = useState<Partial<Record<keyof FormularioCliente, string>>>({});
  const [mensajeAyuda, setMensajeAyuda] = useState<string>("");

  useEffect(() => {
    setDatos(datosIniciales);
    setErrores({});
    setMensajeAyuda("");
  }, [datosIniciales]);

  const cambiarCampo = <K extends keyof FormularioCliente>(campo: K, valor: FormularioCliente[K]) => {
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
    <section className="clientes-seccion">
      {/* Bloque: encabezado de formulario */}
      <div className="clientes-seccion-header">
        <div>
          <h2 className="clientes-h2">{modo === "crear" ? "Crear cliente" : "Editar cliente"}</h2>
          <p className="clientes-subtitulo">
            Datos claros y grandes. Si falta algo, después lo completás.
          </p>
        </div>

        <div className="clientes-acciones">
          <Boton variante="secundario" onClick={alCancelar}>
            Volver
          </Boton>
          <Boton variante="principal" type="submit" form="clientes-formulario">
            {modo === "crear" ? "Guardar cliente" : "Guardar cambios"}
          </Boton>
        </div>
      </div>

      {/* Bloque: formulario */}
      <form id="clientes-formulario" className="clientes-form" onSubmit={manejarSubmit}>
        <div className="clientes-form-grid">
          <label className="clientes-label">
            Nombre y apellido <span className="clientes-requerido">*</span>
            <input
              className={`clientes-input ${errores.nombreCompleto ? "clientes-input-error" : ""}`}
              value={datos.nombreCompleto}
              onChange={(e) => cambiarCampo("nombreCompleto", e.target.value)}
              placeholder="Ej: Marta González"
              autoComplete="name"
            />
            {errores.nombreCompleto && <span className="clientes-error">{errores.nombreCompleto}</span>}
          </label>

          <label className="clientes-label">
            DNI / CUIL <span className="clientes-requerido">*</span>
            <input
              className={`clientes-input ${errores.dniCuil ? "clientes-input-error" : ""}`}
              value={datos.dniCuil}
              onChange={(e) => cambiarCampo("dniCuil", e.target.value)}
              placeholder="Ej: 27-12345678-9"
              inputMode="numeric"
            />
            {errores.dniCuil && <span className="clientes-error">{errores.dniCuil}</span>}
          </label>

          <label className="clientes-label">
            Teléfono
            <input
              className={`clientes-input ${errores.telefono ? "clientes-input-error" : ""}`}
              value={datos.telefono}
              onChange={(e) => cambiarCampo("telefono", e.target.value)}
              placeholder="Ej: 351 555-1234"
              inputMode="tel"
              autoComplete="tel"
            />
            {errores.telefono && <span className="clientes-error">{errores.telefono}</span>}
          </label>

          <label className="clientes-label">
            Email
            <input
              className={`clientes-input ${errores.email ? "clientes-input-error" : ""}`}
              value={datos.email}
              onChange={(e) => cambiarCampo("email", e.target.value)}
              placeholder="Ej: marta@gmail.com"
              inputMode="email"
              autoComplete="email"
            />
            {errores.email && <span className="clientes-error">{errores.email}</span>}
          </label>

          <label className="clientes-label clientes-label-ancho">
            Dirección
            <input
              className="clientes-input"
              value={datos.direccion}
              onChange={(e) => cambiarCampo("direccion", e.target.value)}
              placeholder="Ej: Av. Siempre Viva 123"
              autoComplete="street-address"
            />
          </label>

          <label className="clientes-label">
            Localidad
            <input
              className="clientes-input"
              value={datos.localidad}
              onChange={(e) => cambiarCampo("localidad", e.target.value)}
              placeholder="Ej: Córdoba"
              autoComplete="address-level2"
            />
          </label>

          <label className="clientes-label">
            Provincia
            <input
              className="clientes-input"
              value={datos.provincia}
              onChange={(e) => cambiarCampo("provincia", e.target.value)}
              placeholder="Ej: Córdoba"
              autoComplete="address-level1"
            />
          </label>

          <label className="clientes-label clientes-label-ancho">
            Notas (opcional)
            <textarea
              className="clientes-textarea"
              value={datos.notas}
              onChange={(e) => cambiarCampo("notas", e.target.value)}
              placeholder="Ej: Prefiere llamadas por la mañana. Trajo escritura el 10/01."
              rows={4}
            />
          </label>
        </div>

        {/* Bloque: ayuda/errores generales */}
        {mensajeAyuda && <div className="clientes-aviso clientes-aviso-error">{mensajeAyuda}</div>}

        <div className="clientes-ayuda">
          <span className="clientes-punto" aria-hidden="true" />
          Tip: podés cargar lo mínimo ahora (nombre y DNI/CUIL) y completar después.
        </div>
      </form>
    </section>
  );
}

export default function Clientes() {
  const contenedorRef = useRef<HTMLDivElement | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Bloque: glow con mouse (mismo estilo que dashboard)
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  // Bloque: menú lateral
  const [menuIzquierdaAbierto, setMenuIzquierdaAbierto] = useState(false);
  const alternarMenuIzquierda = () => setMenuIzquierdaAbierto((e) => !e);
  const cerrarMenuIzquierda = () => setMenuIzquierdaAbierto(false);

  // Bloque: datos reales desde API
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const cargarClientes = () => {
    fetch("http://localhost:4000/api/clientes")
      .then(res => res.json())
      .then(data => {
        setClientes(data);
      })
      .catch(err => {
        console.error("Error al cargar clientes:", err);
      });
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  // Bloque: navegación interna de la página (URL state)
  const modo = (searchParams.get("modo") as ModoPagina) || "listado";
  const clienteSeleccionadoId = searchParams.get("id");

  // Bloque: búsqueda y orden
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<"recientes" | "antiguos" | "alfabetico">("recientes");

  // Bloque: UI de confirmación/borrado
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [mensajeToast, setMensajeToast] = useState<string>("");

  // Cerrar menú con ESC (comodidad)
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

  // Mouse glow leve
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

  // “Toast” simple
  useEffect(() => {
    if (!mensajeToast) return;
    const t = window.setTimeout(() => setMensajeToast(""), 2800);
    return () => window.clearTimeout(t);
  }, [mensajeToast]);

  const clienteSeleccionado = useMemo(() => {
    if (!clienteSeleccionadoId) return null;
    return clientes.find((c) => c.id === clienteSeleccionadoId) ?? null;
  }, [clienteSeleccionadoId, clientes]);

  const clientesFiltrados = useMemo(() => {
    const texto = normalizarTexto(busqueda);

    let filtrados = texto
      ? clientes.filter((c) => {
        const bolsa = normalizarTexto(
          [
            c.nombreCompleto,
            c.dniCuil,
            c.telefono,
            c.email,
            c.direccion,
            c.localidad,
            c.provincia,
            c.notas,
          ].join(" ")
        );
        return bolsa.includes(texto);
      })
      : [...clientes];

    // Aplicar orden
    return filtrados.sort((a, b) => {
      if (orden === "recientes") return Number(b.id) - Number(a.id);
      if (orden === "antiguos") return Number(a.id) - Number(b.id);
      return a.nombreCompleto.localeCompare(b.nombreCompleto);
    });
  }, [busqueda, clientes, orden]);

  const abrirCrear = () => {
    setSearchParams({ modo: "crear" });
  };

  const abrirVer = (id: string) => {
    setSearchParams({ modo: "ver", id });
  };

  const abrirEditar = (id: string) => {
    setSearchParams({ modo: "editar", id });
  };

  const volverAlListado = () => {
    setSearchParams({}); // Vuelve a params vacíos (listado por defecto)
    setModalEliminarAbierto(false);
  };

  const datosInicialesCrear: FormularioCliente = useMemo(
    () => ({
      nombreCompleto: "",
      dniCuil: "",
      telefono: "",
      email: "",
      direccion: "",
      localidad: "",
      provincia: "",
      notas: "",
    }),
    []
  );

  const datosInicialesEditar: FormularioCliente = useMemo(() => {
    if (!clienteSeleccionado) return datosInicialesCrear;
    const { nombreCompleto, dniCuil, telefono, email, direccion, localidad, provincia, notas } = clienteSeleccionado;
    return { nombreCompleto, dniCuil, telefono, email, direccion, localidad, provincia, notas };
  }, [clienteSeleccionado, datosInicialesCrear]);

  const guardarClienteNuevo = (datos: FormularioCliente) => {
    fetch("http://localhost:4000/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    })
      .then(res => res.json())
      .then(res => {
        setMensajeToast("Cliente creado");
        cargarClientes();
        abrirVer(res.id.toString());
      })
      .catch(err => console.error("Error al crear cliente:", err));
  };

  const guardarEdicionCliente = (datos: FormularioCliente) => {
    if (!clienteSeleccionado) return;

    fetch(`http://localhost:4000/api/clientes/${clienteSeleccionado.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    })
      .then(() => {
        setMensajeToast("Cambios guardados");
        cargarClientes();
        abrirVer(clienteSeleccionado.id);
      })
      .catch(err => console.error("Error al editar cliente:", err));
  };

  const pedirEliminarCliente = () => {
    if (!clienteSeleccionado) return;
    setModalEliminarAbierto(true);
  };

  const confirmarEliminarCliente = () => {
    if (!clienteSeleccionado) return;

    fetch(`http://localhost:4000/api/clientes/${clienteSeleccionado.id}`, {
      method: "DELETE"
    })
      .then(() => {
        setMensajeToast("Cliente eliminado ");
        setModalEliminarAbierto(false);
        cargarClientes();
        volverAlListado();
      })
      .catch(err => {
        console.error("Error al eliminar cliente:", err);
        setMensajeToast("Error al eliminar");
      });
  };

  return (
    <>
      <div
        ref={contenedorRef}
        className="clientes-pagina"
        style={
          {
            "--mx": `${mouse.x}%`,
            "--my": `${mouse.y}%`,
          } as React.CSSProperties
        }
      >
        {/* Header */}
        <header className="clientes-header">
          <div className="clientes-header-izquierda">
            <button
              className="boton-menu-unificado"
              type="button"
              onClick={alternarMenuIzquierda}
              aria-label="Abrir menú lateral"
              title="Menú"
            >
              ☰
            </button>

            <div>
              <h1 className="clientes-h1">Clientes</h1>
              <p className="clientes-descripcion">
                Buscar, crear, editar y ver clientes.
              </p>
            </div>
          </div>

          <div className="clientes-header-derecha">
            {modo === "listado" && (
              <Boton variante="principal" onClick={abrirCrear}>
                + Crear cliente
              </Boton>
            )}
          </div>
        </header>

        {/* Toast */}
        {mensajeToast && <div className="clientes-toast">{mensajeToast}</div>}

        {/* Contenido */}
        {modo === "listado" && (
          <>
            {/* Bloque: búsqueda y filtros */}
            <section className="clientes-seccion">
              <div className="clientes-seccion-header">
                <div>
                  <h2 className="clientes-h2">Listado de clientes</h2>
                  <p className="clientes-subtitulo">Tip: buscá por nombre, DNI/CUIL, teléfono o dirección.</p>
                </div>

                <div className="clientes-acciones">
                  <select
                    className="clientes-input"
                    style={{ width: 'auto', padding: '4px 8px' }}
                    value={orden}
                    onChange={(e) => setOrden(e.target.value as any)}
                  >
                    <option value="recientes">Más recientes</option>
                    <option value="antiguos">Más antiguos</option>
                    <option value="alfabetico">Alfabéticamente</option>
                  </select>
                </div>
              </div>

              <div className="clientes-barra-busqueda">
                <input
                  className="clientes-input clientes-input-busqueda"
                  placeholder="Buscar cliente… (ej: Marta, 27-..., Villa Allende)"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                <div className="clientes-contador">
                  {clientesFiltrados.length} {clientesFiltrados.length === 1 ? "resultado" : "resultados"}
                </div>
              </div>

              {/* Bloque: tabla/lista */}
              {clientesFiltrados.length === 0 ? (
                <div className="clientes-vacio">
                  <div className="clientes-vacio-titulo">No hay resultados</div>
                  <div className="clientes-vacio-sub">Probá con otro texto o creá un cliente nuevo.</div>
                  <Boton variante="principal" onClick={abrirCrear}>
                    Crear cliente
                  </Boton>
                </div>
              ) : (
                <div className="clientes-tabla-contenedor" role="region" aria-label="Tabla de clientes">
                  <table className="clientes-tabla">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>DNI/CUIL</th>
                        <th>Contacto</th>
                        <th>Ubicación</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientesFiltrados.map((c) => (
                        <tr key={c.id}>
                          <td>
                            <div className="clientes-celda-principal">
                              <div className="clientes-avatar" aria-hidden="true">
                                {c.nombreCompleto.trim().slice(0, 1).toUpperCase() || "C"}
                              </div>
                              <div>
                                <div className="clientes-nombre">{c.nombreCompleto}</div>
                                <div className="clientes-sub">{c.id}</div>
                              </div>
                            </div>
                          </td>
                          <td>{c.dniCuil || "—"}</td>
                          <td>
                            <div className="clientes-sub">{c.telefono || "—"}</div>
                            <div className="clientes-sub">{c.email || ""}</div>
                          </td>
                          <td>
                            <div className="clientes-sub">{c.localidad || "—"}</div>
                            <div className="clientes-sub">{c.direccion || ""}</div>
                          </td>
                          <td>
                            <div className="clientes-acciones-tabla">
                              <BotonIcono titulo="Ver cliente" icono="ver" onClick={() => abrirVer(c.id)} />
                              <BotonIcono titulo="Editar cliente" icono="editar" onClick={() => abrirEditar(c.id)} />
                              <BotonIcono titulo="Imprimir ficha" icono="imprimir" onClick={() => window.print()} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {modo === "crear" && (
          <FormularioClientes
            modo="crear"
            datosIniciales={datosInicialesCrear}
            alCancelar={volverAlListado}
            alGuardar={guardarClienteNuevo}
          />
        )}

        {modo === "editar" && (
          <FormularioClientes
            modo="editar"
            datosIniciales={datosInicialesEditar}
            alCancelar={() => (clienteSeleccionadoId ? abrirVer(clienteSeleccionadoId) : volverAlListado())}
            alGuardar={guardarEdicionCliente}
          />
        )}

        {modo === "ver" && clienteSeleccionado && (
          <section className="clientes-seccion">
            {/* Bloque: encabezado ver */}
            <div className="clientes-seccion-header">
              <div>
                <h2 className="clientes-h2">Ver cliente</h2>
                <p className="clientes-subtitulo">Información completa del cliente.</p>
              </div>

              <div className="clientes-acciones">
                <Boton variante="secundario" onClick={volverAlListado}>
                  Volver
                </Boton>
                <Boton variante="principal" onClick={() => abrirEditar(clienteSeleccionado.id)}>
                  Editar
                </Boton>
                <Boton variante="peligro" onClick={pedirEliminarCliente}>
                  Eliminar
                </Boton>
              </div>
            </div>

            {/* Bloque: tarjeta de datos */}
            <div className="clientes-tarjeta-detalle">
              <div className="clientes-detalle-header">
                <div className="clientes-detalle-titulo">
                  <div className="clientes-avatar clientes-avatar-grande" aria-hidden="true">
                    {clienteSeleccionado.nombreCompleto.trim().slice(0, 1).toUpperCase() || "C"}
                  </div>
                  <div>
                    <div className="clientes-detalle-nombre">{clienteSeleccionado.nombreCompleto}</div>
                    <div className="clientes-sub">
                      {clienteSeleccionado.id}
                    </div>
                  </div>
                </div>

                <div className="clientes-detalle-acciones-rapidas">
                  <a
                    className="clientes-chip"
                    href={clienteSeleccionado.telefono ? `tel:${clienteSeleccionado.telefono}` : undefined}
                    aria-disabled={!clienteSeleccionado.telefono}
                    onClick={(e) => {
                      if (!clienteSeleccionado.telefono) e.preventDefault();
                    }}
                    title={clienteSeleccionado.telefono ? "Llamar" : "Sin teléfono"}
                  >
                    Llamar
                  </a>

                  <a
                    className="clientes-chip"
                    href={clienteSeleccionado.email ? `mailto:${clienteSeleccionado.email}` : undefined}
                    aria-disabled={!clienteSeleccionado.email}
                    onClick={(e) => {
                      if (!clienteSeleccionado.email) e.preventDefault();
                    }}
                    title={clienteSeleccionado.email ? "Enviar email" : "Sin email"}
                  >
                    Email
                  </a>
                </div>
              </div>

              <div className="clientes-detalle-grid">
                <EtiquetaDato titulo="DNI/CUIL" valor={clienteSeleccionado.dniCuil} />
                <EtiquetaDato titulo="Teléfono" valor={clienteSeleccionado.telefono} />
                <EtiquetaDato titulo="Email" valor={clienteSeleccionado.email} />
                <EtiquetaDato titulo="Dirección" valor={clienteSeleccionado.direccion} />
                <EtiquetaDato titulo="Localidad" valor={clienteSeleccionado.localidad} />
                <EtiquetaDato titulo="Provincia" valor={clienteSeleccionado.provincia} />
              </div>

              <div className="clientes-notas">
                <div className="clientes-notas-titulo">Notas</div>
                <div className="clientes-notas-texto">{clienteSeleccionado.notas || "—"}</div>
              </div>
            </div>

            <ModalConfirmacion
              abierto={modalEliminarAbierto}
              titulo="Eliminar cliente"
              descripcion="Esto borra el cliente del listado. Si querés, primero copiá los datos."
              textoCancelar="Cancelar"
              textoConfirmar="Sí, eliminar"
              alCancelar={() => setModalEliminarAbierto(false)}
              alConfirmar={confirmarEliminarCliente}
            />
          </section>
        )}

        {modo === "ver" && !clienteSeleccionado && (
          <section className="clientes-seccion">
            <div className="clientes-vacio">
              <div className="clientes-vacio-titulo">No se pudo abrir el cliente</div>
              <div className="clientes-vacio-sub">Puede que ya no exista o haya cambiado el listado.</div>
              <Boton variante="principal" onClick={volverAlListado}>
                Volver al listado
              </Boton>
            </div>
          </section>
        )}
      </div>

      {/* Menú lateral (igual que en Dashboard) */}
      <BarraLateralIzquierda abierto={menuIzquierdaAbierto} alCerrar={cerrarMenuIzquierda} />
    </>
  );
}
