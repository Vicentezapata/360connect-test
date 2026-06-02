import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Sucursales from './pages/Sucursales'
import Visor360 from './pages/Visor360'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Sucursales />} />
      <Route path="/sucursal/:id" element={<Visor360 />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
