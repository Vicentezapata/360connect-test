import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, Building2, Camera, Map, Edit3, ChevronRight, MapPin } from 'lucide-react'
import { mockSucursales } from '../data/mock'

const ESTADOS = ['todos', 'activo', 'inactivo']
const REGIONES = ['todas', 'Metropolitana', 'Valparaíso', 'Biobío', 'Antofagasta']

const estadoBadge = (estado: string) => {
  const map: Record<string, { label: string; color: string }> = {
    activo: { label: 'Activo', color: 'var(--accent-green)' },
    inactivo: { label: 'Inactivo', color: 'var(--accent-red)' },
    pendiente: { label: 'Pendiente', color: 'var(--accent-orange)' },
  }
  return map[estado] ?? { label: estado, color: 'var(--text-secondary)' }
}

export default function Sucursales() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('todos')
  const [region, setRegion] = useState('todas')

  const filtered = mockSucursales.filter((s) => {
    const matchSearch = s.nombre.toLowerCase().includes(search.toLowerCase()) || s.ciudad.toLowerCase().includes(search.toLowerCase())
    const matchEstado = estado === 'todos' || s.estado === estado
    const matchRegion = region === 'todas' || s.region === region
    return matchSearch && matchEstado && matchRegion
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Sucursales</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {filtered.length} de {mockSucursales.length} sucursales
          </p>
        </div>
        <Link
          to="/sucursales/nueva"
          className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
        >
          <Plus size={16} />
          Nueva Sucursal
        </Link>
      </div>

      {/* Filters */}
      <div
        className="flex flex-wrap items-center gap-3 p-4 rounded-xl border"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o ciudad..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border text-sm outline-none"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="h-9 px-3 rounded-lg border text-sm outline-none"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        >
          {ESTADOS.map((e) => <option key={e} value={e}>{e === 'todos' ? 'Todos los estados' : e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
        </select>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="h-9 px-3 rounded-lg border text-sm outline-none"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        >
          {REGIONES.map((r) => <option key={r} value={r}>{r === 'todas' ? 'Todas las regiones' : r}</option>)}
        </select>
      </div>

      {/* Table */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Sucursal', 'Ciudad / Región', 'Coordenadas', 'Estado', 'Espacios', 'Acciones'].map((h) => (
                <th key={h} className="text-left text-xs font-medium px-5 py-3" style={{ color: 'var(--text-secondary)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => {
              const badge = estadoBadge(s.estado)
              return (
                <tr
                  key={s.id}
                  style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}
                  className="transition-colors hover:bg-[var(--bg-hover)]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'var(--accent-blue)22', color: 'var(--accent-blue)' }}
                      >
                        <Building2 size={16} />
                      </div>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.nombre}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{s.ciudad}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{s.region}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} style={{ color: 'var(--text-secondary)' }} />
                      <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                        {s.latitud.toFixed(4)}, {s.longitud.toFixed(4)}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-flex items-center h-6 px-2.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: badge.color + '22', color: badge.color }}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{s.totalEspacios ?? 0}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/sucursales/${s.id}/editar`)}
                        className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs transition-all hover:opacity-80"
                        style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
                        title="Editar"
                      >
                        <Edit3 size={13} />
                        Editar
                      </button>
                      <button
                        onClick={() => navigate(`/sucursales/${s.id}/espacios`)}
                        className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs transition-all hover:opacity-80"
                        style={{ backgroundColor: 'var(--accent-blue)22', color: 'var(--accent-blue)' }}
                        title="Espacios 360°"
                      >
                        <Camera size={13} />
                        360°
                      </button>
                      <button
                        onClick={() => navigate(`/sucursales/${s.id}/planimetria`)}
                        className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs transition-all hover:opacity-80"
                        style={{ backgroundColor: 'var(--accent-orange)22', color: 'var(--accent-orange)' }}
                        title="Planimetría"
                      >
                        <Map size={13} />
                        Plano
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Building2 size={40} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-secondary)' }} />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No se encontraron sucursales</p>
          </div>
        )}
      </div>
    </div>
  )
}
