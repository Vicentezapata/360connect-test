import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Save } from 'lucide-react'
import { mockSucursales } from '../data/mock'

const REGIONES = ['Metropolitana', 'Valparaíso', 'Biobío', 'Antofagasta', 'Coquimbo', 'Araucanía', 'Los Lagos', 'Tarapacá']

export default function SucursalForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const existing = mockSucursales.find((s) => s.id === id)

  const [form, setForm] = useState({
    nombre: existing?.nombre ?? '',
    ciudad: existing?.ciudad ?? '',
    region: existing?.region ?? 'Metropolitana',
    estado: existing?.estado ?? 'activo',
    lat: existing?.lat?.toString() ?? '',
    lng: existing?.lng?.toString() ?? '',
    descripcion: '',
    direccion: '',
    telefono: '',
    email_contacto: '',
  })

  const [saved, setSaved] = useState(false)

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => navigate('/sucursales'), 1200)
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/sucursales')}
          className="p-2 rounded-lg transition-all hover:opacity-80"
          style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-card)' }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {isEdit ? 'Editar Sucursal' : 'Nueva Sucursal'}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {isEdit ? `Modificando "${existing?.nombre}"` : 'Completá los datos para crear la sucursal'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos Básicos */}
        <div
          className="rounded-xl border p-6 space-y-4"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
            Datos Básicos
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Nombre *
              </label>
              <input
                required
                value={form.nombre}
                onChange={(e) => set('nombre', e.target.value)}
                placeholder="Ej: Centro Santiago"
                className="w-full h-10 px-3 rounded-lg border text-sm outline-none"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Ciudad *
              </label>
              <input
                required
                value={form.ciudad}
                onChange={(e) => set('ciudad', e.target.value)}
                placeholder="Ej: Santiago"
                className="w-full h-10 px-3 rounded-lg border text-sm outline-none"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Región *
              </label>
              <select
                value={form.region}
                onChange={(e) => set('region', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border text-sm outline-none"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              >
                {REGIONES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Estado
              </label>
              <select
                value={form.estado}
                onChange={(e) => set('estado', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border text-sm outline-none"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Dirección
              </label>
              <input
                value={form.direccion}
                onChange={(e) => set('direccion', e.target.value)}
                placeholder="Ej: Av. Providencia 1234"
                className="w-full h-10 px-3 rounded-lg border text-sm outline-none"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Descripción
              </label>
              <textarea
                value={form.descripcion}
                onChange={(e) => set('descripcion', e.target.value)}
                rows={3}
                placeholder="Descripción breve de la sucursal..."
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>

        {/* Geolocalización */}
        <div
          className="rounded-xl border p-6 space-y-4"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <MapPin size={16} style={{ color: 'var(--accent-blue)' }} />
            <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
              Geolocalización
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Latitud *
              </label>
              <input
                required
                type="number"
                step="0.000001"
                min="-90"
                max="90"
                value={form.lat}
                onChange={(e) => set('lat', e.target.value)}
                placeholder="-33.4500"
                className="w-full h-10 px-3 rounded-lg border text-sm outline-none font-mono"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Longitud *
              </label>
              <input
                required
                type="number"
                step="0.000001"
                min="-180"
                max="180"
                value={form.lng}
                onChange={(e) => set('lng', e.target.value)}
                placeholder="-70.6700"
                className="w-full h-10 px-3 rounded-lg border text-sm outline-none font-mono"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Coordenadas decimales (WGS84). Usadas para visualización en mapa en la app de campo.
          </p>
        </div>

        {/* Contacto */}
        <div
          className="rounded-xl border p-6 space-y-4"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
            Contacto
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Teléfono</label>
              <input
                value={form.telefono}
                onChange={(e) => set('telefono', e.target.value)}
                placeholder="+56 9 1234 5678"
                className="w-full h-10 px-3 rounded-lg border text-sm outline-none"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email de contacto</label>
              <input
                type="email"
                value={form.email_contacto}
                onChange={(e) => set('email_contacto', e.target.value)}
                placeholder="sucursal@empresa.cl"
                className="w-full h-10 px-3 rounded-lg border text-sm outline-none"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/sucursales')}
            className="h-9 px-4 rounded-lg text-sm font-medium border transition-all hover:opacity-80"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'transparent' }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 h-9 px-5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: saved ? 'var(--accent-green)' : 'var(--accent-blue)', color: 'white' }}
          >
            <Save size={15} />
            {saved ? 'Guardado ✓' : isEdit ? 'Guardar Cambios' : 'Crear Sucursal'}
          </button>
        </div>
      </form>
    </div>
  )
}
