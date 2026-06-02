import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Sucursales from './pages/Sucursales'
import SucursalForm from './pages/SucursalForm'
import Espacios from './pages/Espacios'
import Planimetria from './pages/Planimetria'
import HistorialPlanimetria from './pages/HistorialPlanimetria'
import Documentos from './pages/Documentos'
import Usuarios from './pages/Usuarios'
import AuditLog from './pages/AuditLog'
import Configuracion from './pages/Configuracion'
import Comunicaciones from './pages/Comunicaciones'
import Baterias from './pages/Baterias'
import Torres from './pages/Torres'
import Informes from './pages/Informes'
import Notificaciones from './pages/Notificaciones'
import Perfil from './pages/Perfil'
import ViewerSucursales from './pages/viewer/ViewerSucursales'
import Visor360 from './pages/viewer/Visor360'
import MapaGeneral from './pages/MapaGeneral'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Viewer (App de Campo) — sin sidebar */}
      <Route path="/viewer" element={<ViewerSucursales />} />
      <Route path="/viewer/sucursal/:id" element={<Visor360 />} />

      {/* Admin — con sidebar */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mapa" element={<MapaGeneral />} />
        <Route path="/sucursales" element={<Sucursales />} />
        <Route path="/sucursales/nueva" element={<SucursalForm />} />
        <Route path="/sucursales/:id/editar" element={<SucursalForm />} />
        <Route path="/sucursales/:id/espacios" element={<Espacios />} />
        <Route path="/sucursales/:id/planimetria" element={<Planimetria />} />
        <Route path="/sucursales/:id/planimetria/historial" element={<HistorialPlanimetria />} />
        <Route path="/sucursales/:id/comunicaciones" element={<Comunicaciones />} />
        <Route path="/sucursales/:id/baterias" element={<Baterias />} />
        <Route path="/sucursales/:id/torres" element={<Torres />} />
        <Route path="/sucursales/:id/informes" element={<Informes />} />
        <Route path="/documentos" element={<Documentos />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/audit" element={<AuditLog />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/admin/notificaciones" element={<Notificaciones />} />
        <Route path="/admin/perfil" element={<Perfil />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}
