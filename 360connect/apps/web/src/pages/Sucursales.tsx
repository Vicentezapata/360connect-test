import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, ChevronRight, Wifi, Building2, LogOut } from 'lucide-react'

const SUCURSALES = [
  { id: '1', nombre: 'Centro Santiago', ciudad: 'Santiago', region: 'Metropolitana', estado: 'activo', espacios: 8, lat: -33.45, lng: -70.66 },
  { id: '2', nombre: 'Sucursal Providencia', ciudad: 'Providencia', region: 'Metropolitana', estado: 'activo', espacios: 5, lat: -33.42, lng: -70.62 },
  { id: '3', nombre: 'Valparaíso Centro', ciudad: 'Valparaíso', region: 'Valparaíso', estado: 'inactivo', espacios: 3, lat: -33.04, lng: -71.62 },
  { id: '4', nombre: 'Concepción Norte', ciudad: 'Concepción', region: 'Biobío', estado: 'activo', espacios: 6, lat: -36.82, lng: -73.04 },
  { id: '5', nombre: 'Antofagasta Puerto', ciudad: 'Antofagasta', region: 'Antofagasta', estado: 'activo', espacios: 4, lat: -23.65, lng: -70.39 },
]

const REGIONES = ['Todas', ...Array.from(new Set(SUCURSALES.map((s) => s.region)))]

const GRADIENTS = [
  'linear-gradient(135deg, #1a1d27 0%, #252840 100%)',
  'linear-gradient(135deg, #1a2030 0%, #1e3050 100%)',
  'linear-gradient(135deg, #201a27 0%, #352040 100%)',
  'linear-gradient(135deg, #1a2720 0%, #204030 100%)',
  'linear-gradient(135deg, #271a1a 0%, #402020 100%)',
]

export default function Sucursales() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('Todas')

  const filtered = SUCURSALES.filter((s) => {
    const matchSearch = s.nombre.toLowerCase().includes(search.toLowerCase()) || s.ciudad.toLowerCase().includes(search.toLowerCase())
    const matchRegion = region === 'Todas' || s.region === region
    return matchSearch && matchRegion
  })

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 pt-safe"
        style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="max-w-lg mx-auto flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Wifi size={20} style={{ color: 'var(--accent-blue)' }} />
            <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>360Connect</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs"
            style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-card)' }}
          >
            <LogOut size={13} />
            Salir
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Sucursales</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Selecciona una sucursal para visualizar
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar sucursal..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border text-sm outline-none"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
        </div>

        {/* Region filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {REGIONES.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className="flex-shrink-0 h-8 px-3 rounded-full text-xs transition-all"
              style={{
                backgroundColor: region === r ? 'var(--accent-blue)' : 'var(--bg-card)',
                color: region === r ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${region === r ? 'transparent' : 'var(--border)'}`,
              }}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {filtered.map((s, i) => (
            <button
              key={s.id}
              onClick={() => s.estado === 'activo' && navigate(`/sucursal/${s.id}`)}
              disabled={s.estado === 'inactivo'}
              className="w-full rounded-2xl border text-left transition-all active:scale-[0.98] disabled:opacity-50"
              style={{
                background: GRADIENTS[i % GRADIENTS.length],
                borderColor: 'var(--border)',
                overflow: 'hidden',
              }}
            >
              {/* Color bar */}
              <div className="h-1" style={{ backgroundColor: s.estado === 'activo' ? 'var(--accent-blue)' : 'var(--border)' }} />

              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 size={14} style={{ color: 'var(--accent-blue)' }} />
                      <span
                        className="inline-flex h-5 px-2 rounded-full text-xs font-medium items-center"
                        style={{
                          backgroundColor: s.estado === 'activo' ? 'var(--accent-green)22' : 'var(--accent-red)22',
                          color: s.estado === 'activo' ? 'var(--accent-green)' : 'var(--accent-red)',
                        }}
                      >
                        {s.estado === 'activo' ? 'Disponible' : 'No disponible'}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{s.nombre}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin size={12} style={{ color: 'var(--text-secondary)' }} />
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {s.ciudad} · {s.region}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <ChevronRight size={18} style={{ color: 'var(--text-secondary)' }} />
                    <span className="text-xs" style={{ color: 'var(--accent-blue)' }}>
                      {s.espacios} espacios
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

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
