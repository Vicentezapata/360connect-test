import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, ChevronLeft, ChevronRight, Info, FileText,
  ClipboardList, MapPin, X, CheckCircle, Camera
} from 'lucide-react'

const SUCURSALES: Record<string, { nombre: string; ciudad: string }> = {
  '1': { nombre: 'Centro Santiago', ciudad: 'Santiago' },
  '2': { nombre: 'Sucursal Providencia', ciudad: 'Providencia' },
  '3': { nombre: 'Valparaíso Centro', ciudad: 'Valparaíso' },
  '4': { nombre: 'Concepción Norte', ciudad: 'Concepción' },
  '5': { nombre: 'Antofagasta Puerto', ciudad: 'Antofagasta' },
}

const ESPACIOS = [
  { id: '1', nombre: 'Sala Principal', hue: 220 },
  { id: '2', nombre: 'Sala de Reuniones', hue: 260 },
  { id: '3', nombre: 'Bodega', hue: 190 },
  { id: '4', nombre: 'Recepción', hue: 300 },
]

type Panel = 'info' | 'visita' | 'plano' | null

interface VisitaForm {
  tipo: string
  descripcion: string
  prioridad: string
}

function PanelInfo({ onClose }: { onClose: () => void }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Información General</h3>
        <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}><X size={16} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="space-y-3">
          {[
            { label: 'Dirección', value: 'Av. Libertador Bernardo O\'Higgins 1234, Santiago' },
            { label: 'Teléfono', value: '+56 2 2345 6789' },
            { label: 'Horario', value: 'Lun–Vie 08:00–18:00' },
            { label: 'Responsable', value: 'Juan Pérez' },
            { label: 'Última visita', value: '12 Ene 2024' },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <p className="text-xs mb-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PanelVisita({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<VisitaForm>({ tipo: 'inspección', descripcion: '', prioridad: 'normal' })
  const [sent, setSent] = useState(false)
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const inputStyle = { backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }

  if (sent) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <CheckCircle size={48} style={{ color: 'var(--accent-green)' }} className="mb-4" />
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>¡Visita registrada!</h3>
        <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>El reporte ha sido enviado correctamente</p>
        <button
          onClick={() => { setSent(false); setForm({ tipo: 'inspección', descripcion: '', prioridad: 'normal' }) }}
          className="mt-6 h-9 px-4 rounded-xl text-sm"
          style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
        >
          Nuevo reporte
        </button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Registrar Visita</h3>
        <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}><X size={16} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Tipo de visita</label>
          <select value={form.tipo} onChange={(e) => set('tipo', e.target.value)}
            className="w-full h-9 px-3 rounded-xl border text-sm outline-none" style={inputStyle}>
            <option value="inspección">Inspección</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="emergencia">Emergencia</option>
            <option value="instalación">Instalación</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Prioridad</label>
          <div className="flex gap-2">
            {['baja', 'normal', 'alta', 'urgente'].map((p) => (
              <button
                key={p}
                onClick={() => set('prioridad', p)}
                className="flex-1 h-8 rounded-xl text-xs capitalize transition-all"
                style={{
                  backgroundColor: form.prioridad === p
                    ? p === 'urgente' ? 'var(--accent-red)' : p === 'alta' ? 'var(--accent-orange)' : 'var(--accent-blue)'
                    : 'var(--bg-secondary)',
                  color: form.prioridad === p ? 'white' : 'var(--text-secondary)',
                  border: `1px solid ${form.prioridad === p ? 'transparent' : 'var(--border)'}`,
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Descripción</label>
          <textarea
            value={form.descripcion}
            onChange={(e) => set('descripcion', e.target.value)}
            placeholder="Describe el trabajo realizado o los hallazgos..."
            rows={4}
            className="w-full px-3 py-2 rounded-xl border text-sm outline-none resize-none"
            style={inputStyle}
          />
        </div>
        <button
          onClick={() => setSent(true)}
          className="w-full h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
          style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
        >
          <Camera size={16} />
          Enviar reporte
        </button>
      </div>
    </div>
  )
}

function PanelPlano({ onClose }: { onClose: () => void }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Planimetría</h3>
        <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}><X size={16} /></button>
      </div>
      <div className="flex-1 p-4">
        {/* Floor plan mock */}
        <svg width="100%" viewBox="0 0 300 220" style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px' }}>
          {/* Outer walls */}
          <rect x="20" y="20" width="260" height="180" fill="none" stroke="var(--border)" strokeWidth="3" rx="2" />
          {/* Rooms */}
          <rect x="20" y="20" width="140" height="90" fill="var(--bg-hover)" stroke="var(--border)" strokeWidth="1.5" />
          <text x="90" y="68" textAnchor="middle" fontSize="10" fill="var(--text-secondary)">Sala Principal</text>
          <rect x="160" y="20" width="120" height="90" fill="var(--bg-hover)" stroke="var(--border)" strokeWidth="1.5" />
          <text x="220" y="68" textAnchor="middle" fontSize="10" fill="var(--text-secondary)">Reuniones</text>
          <rect x="20" y="110" width="80" height="90" fill="var(--bg-hover)" stroke="var(--border)" strokeWidth="1.5" />
          <text x="60" y="158" textAnchor="middle" fontSize="10" fill="var(--text-secondary)">Bodega</text>
          <rect x="100" y="110" width="180" height="90" fill="var(--bg-hover)" stroke="var(--border)" strokeWidth="1.5" />
          <text x="190" y="158" textAnchor="middle" fontSize="10" fill="var(--text-secondary)">Recepción</text>
          {/* Markers */}
          {[{ x: 90, y: 55 }, { x: 220, y: 55 }, { x: 60, y: 145 }, { x: 190, y: 145 }].map((m, i) => (
            <circle key={i} cx={m.x} cy={m.y} r="7" fill="var(--accent-blue)" opacity="0.8" />
          ))}
        </svg>
        <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>
          Los puntos azules representan puntos de vista 360°
        </p>
      </div>
    </div>
  )
}

export default function Visor360() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const sucursal = SUCURSALES[id ?? '1'] ?? SUCURSALES['1']

  const [espacioIdx, setEspacioIdx] = useState(0)
  const [panel, setPanel] = useState<Panel>(null)
  const [dragStart, setDragStart] = useState<number | null>(null)
  const [rotation, setRotation] = useState(0)
  const [dragging, setDragging] = useState(false)

  const espacio = ESPACIOS[espacioIdx]

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStart(e.clientX)
    setDragging(true)
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStart === null) return
    const delta = (e.clientX - dragStart) * 0.3
    setRotation((r) => r + delta)
    setDragStart(e.clientX)
  }
  const handleMouseUp = () => { setDragStart(null); setDragging(false) }

  const nextEspacio = () => setEspacioIdx((i) => (i + 1) % ESPACIOS.length)
  const prevEspacio = () => setEspacioIdx((i) => (i - 1 + ESPACIOS.length) % ESPACIOS.length)

  const togglePanel = (p: Panel) => setPanel((cur) => cur === p ? null : p)

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: '#000' }}>
      {/* 360° Sphere Background */}
      <div
        className="absolute inset-0 select-none"
        style={{
          background: `
            radial-gradient(ellipse at ${50 + rotation * 0.02}% 50%, 
              hsl(${espacio.hue}, 40%, 8%) 0%, 
              hsl(${espacio.hue}, 30%, 4%) 60%, 
              #000 100%)
          `,
          cursor: dragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={(e) => setDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => {
          if (dragStart === null) return
          const delta = (e.touches[0].clientX - dragStart) * 0.3
          setRotation((r) => r + delta)
          setDragStart(e.touches[0].clientX)
        }}
        onTouchEnd={() => setDragStart(null)}
      >
        {/* Grid lines simulating sphere */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`v${i}`} x1={`${(i * 100) / 12 + ((rotation * 0.5) % (100 / 12))}%`} y1="0" x2={`${(i * 100) / 12 + ((rotation * 0.5) % (100 / 12))}%`} y2="100" stroke={`hsl(${espacio.hue}, 60%, 50%)`} strokeWidth="0.3" />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={`${(i * 100) / 6}%`} x2="100" y2={`${(i * 100) / 6}%`} stroke={`hsl(${espacio.hue}, 60%, 50%)`} strokeWidth="0.3" />
          ))}
        </svg>

        {/* Ambient hotspot markers */}
        {[25, 50, 75].map((pos) => (
          <div
            key={pos}
            className="absolute w-5 h-5 rounded-full border-2 animate-pulse"
            style={{
              left: `${(pos + rotation * 0.1) % 90 + 5}%`,
              top: '45%',
              borderColor: `hsl(${espacio.hue}, 80%, 65%)`,
              backgroundColor: `hsl(${espacio.hue}, 60%, 20%)`,
              opacity: 0.7,
            }}
          />
        ))}

        {/* Room label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-6xl font-black opacity-5 select-none" style={{ color: `hsl(${espacio.hue}, 60%, 70%)` }}>
            {espacio.nombre.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 h-9 px-3 rounded-xl text-sm"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', backdropFilter: 'blur(8px)' }}
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">{sucursal.nombre}</span>
        </button>

        <div className="flex items-center gap-1.5 h-8 px-3 rounded-xl text-sm"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: 'var(--text-secondary)', backdropFilter: 'blur(8px)' }}>
          <MapPin size={13} style={{ color: 'var(--accent-blue)' }} />
          {sucursal.ciudad}
        </div>
      </div>

      {/* Espacio navigation */}
      <div className="absolute bottom-24 left-0 right-0 flex items-center justify-center gap-3 z-20 px-4">
        <button onClick={prevEspacio}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', backdropFilter: 'blur(8px)' }}>
          <ChevronLeft size={18} />
        </button>

        <div
          className="flex items-center gap-2 h-9 px-4 rounded-full"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        >
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{espacio.nombre}</span>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {espacioIdx + 1}/{ESPACIOS.length}
          </span>
        </div>

        <button onClick={nextEspacio}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', backdropFilter: 'blur(8px)' }}>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-1.5 z-20">
        {ESPACIOS.map((_, i) => (
          <button key={i} onClick={() => setEspacioIdx(i)}
            className="w-1.5 h-1.5 rounded-full transition-all"
            style={{ backgroundColor: i === espacioIdx ? 'var(--accent-blue)' : 'rgba(255,255,255,0.3)' }}
          />
        ))}
      </div>

      {/* Bottom action bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-around px-4 py-3"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}
      >
        {[
          { id: 'info' as Panel, icon: Info, label: 'Info' },
          { id: 'visita' as Panel, icon: ClipboardList, label: 'Visita' },
          { id: 'plano' as Panel, icon: FileText, label: 'Plano' },
        ].map(({ id: panelId, icon: Icon, label }) => (
          <button
            key={panelId}
            onClick={() => togglePanel(panelId)}
            className="flex flex-col items-center gap-1 w-16 h-14 rounded-xl justify-center transition-all"
            style={{
              backgroundColor: panel === panelId ? 'var(--accent-blue)33' : 'rgba(0,0,0,0.5)',
              color: panel === panelId ? 'var(--accent-blue)' : 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${panel === panelId ? 'var(--accent-blue)44' : 'transparent'}`,
            }}
          >
            <Icon size={18} />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>

      {/* Side Panel */}
      {panel && (
        <div
          className="absolute top-0 right-0 bottom-0 w-80 z-30 overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderLeft: '1px solid var(--border)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {panel === 'info' && <PanelInfo onClose={() => setPanel(null)} />}
          {panel === 'visita' && <PanelVisita onClose={() => setPanel(null)} />}
          {panel === 'plano' && <PanelPlano onClose={() => setPanel(null)} />}
        </div>
      )}
    </div>
  )
}
