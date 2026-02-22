import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NuevaFicha from "./pages/NuevaFicha";
import Clientes from "./pages/clientes";
import Terrenos from "./pages/Terrenos";
import DetalleTerreno from "./pages/DetalleTerreno";
import Expedientes from "./pages/Expedientes";
import DetalleExpediente from "./pages/DetalleExpediente";
import NuevoExpediente from "./pages/NuevoExpediente";
import Honorarios from "./pages/Honorarios";
import Calendario from "./pages/Calendario";
import Usuarios from "./pages/Usuarios";
import PortalCliente from "./pages/PortalCliente";
import Landing from "./pages/Landing";
import Finanzas from "./pages/Finanzas";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import RegisterInvitation from "./pages/RegisterInvitation";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Landing />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/registro-cliente" element={<RegisterInvitation />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Otras páginas */}
        <Route path="/nueva_ficha" element={<NuevaFicha />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/terrenos" element={<Terrenos />} />
        <Route path="/terrenos/detalle/:id" element={<DetalleTerreno />} />

        {/* Expedientes */}
        <Route path="/expedientes" element={<Expedientes />} />
        <Route path="/expedientes/crear" element={<NuevoExpediente />} />
        <Route path="/expedientes/detalle/:id" element={<DetalleExpediente />} />

        {/* Honorarios */}
        <Route path="/honorarios" element={<Honorarios />} />
        <Route path="/finanzas" element={<Finanzas />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/portal-cliente/:id" element={<PortalCliente />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
