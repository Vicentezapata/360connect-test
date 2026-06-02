import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Viewer } from '@photo-sphere-viewer/core'
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin'
import '@photo-sphere-viewer/core/index.css'
import '@photo-sphere-viewer/markers-plugin/index.css'
import {
  ArrowLeft, ChevronLeft, ChevronRight, Info, FileText,
  ClipboardList, MapPin, X, CheckCircle, Camera, Maximize2, Minimize2
} from 'lucide-react'

const SUCURSALES: Record<string, { nombre: string; ciudad: string }> = {
  '1': { nombre: 'Centro Santiago', ciudad: 'Santiago' },
  '2': { nombre: 'Sucursal Providencia', ciudad: 'Providencia' },
  '3': { nombre: 'ValparaÃ­so Centro', ciudad: 'ValparaÃ­so' },
  '4': { nombre: 'ConcepciÃ³n Norte', ciudad: 'ConcepciÃ³n' },
  '5': { nombre: 'Antofagasta Puerto', ciudad: 'Antofagasta' },
}

// Sample panoramas â€” equirectangular images from Photo Sphere Viewer demo (free/open)
const ESPACIOS = [
  {
    id: '1',
    nombre: 'Sala Principal',
    panorama: 'https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg',
    markers: [
      { id: 'm1', position: { yaw: '0deg', pitch: '-5deg' }, tooltip: 'Acceso principal', color: '#4f7cff' },
      { id: 'm2', position: { yaw: '90deg', pitch: '10deg' }, tooltip: 'Tablero elÃ©ctrico', color: '#ff7c4f' },
      { id: 'm3', position: { yaw: '180deg', pitch: '-10deg' }, tooltip: 'Sala de reuniones â†’', color: '#4fff8b' },
    ],
  },
  {
    id: '2',
    nombre: 'Sala de Reuniones',
    panorama: 'https://photo-sphere-viewer-data.netlify.app/assets/sphere-small.jpg',
    markers: [
      { id: 'm1', position: { yaw: '45deg', pitch: '5deg' }, tooltip: 'Proyector', color: '#ff7c4f' },
      { id: 'm2', position: { yaw: '-90deg', pitch: '-5deg' }, tooltip: 'Sala Principal â†', color: '#4fff8b' },
    ],
  },
  {
    id: '3',
    nombre: 'Bodega',
    panorama: 'https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg',
    markers: [
      { id: 'm1', position: { yaw: '120deg', pitch: '0deg' }, tooltip: 'Estantes zona A', color: '#4f7cff' },
      { id: 'm2', position: { yaw: '240deg', pitch: '-8deg' }, tooltip: 'Salida emergencia', color: '#ff4f6b' },
    ],
  },
  {
    id: '4',
    nombre: 'RecepciÃ³n',
    panorama: 'https://photo-sphere-viewer-data.netlify.app/assets/sphere-small.jpg',
    markers: [
      { id: 'm1', position: { yaw: '0deg', pitch: '0deg' }, tooltip: 'Mostrador principal', color: '#4f7cff' },
      { id: 'm2', position: { yaw: '150deg', pitch: '5deg' }, tooltip: 'Ingreso clientes', color: '#4fff8b' },
    ],
  },
]

type Panel = 'info' | 'visita' | 'plano' | null

/** Minimal PSV wrapper â€” mounts/unmounts properly on panorama change */
function PanoramaViewer({
  panorama,
  markers,
}: {
  panorama: string
  markers: { id: string; position: { yaw: string; pitch: string }; tooltip: string; color: string }[]
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<Viewer | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const viewer = new Viewer({
      container: containerRef.current,
      panorama,
      defaultYaw: 0,
      defaultPitch: 0,
      mousewheel: true,
      touchmoveTwoFingers: false,
      navbar: false,
      plugins: [
        [
          MarkersPlugin,
          {
            markers: markers.map((m) => ({
              id: m.id,
              position: m.position,
              html: `<div style="
                width:32px;height:32px;
                border-radius:50%;
                background:${m.color}33;
                border:2px solid ${m.color};
                display:flex;align-items:center;justify-content:center;
                cursor:pointer;
                animation:pulse-dot 1.5s ease-in-out infinite;
              ">
                <div style="width:10px;height:10px;border-radius:50%;background:${m.color}"></div>
              </div>`,
              tooltip: { content: m.tooltip, position: 'top' },
              anchor: 'center center',
            })),
          },
        ],
      ],
    })

    viewerRef.current = viewer
    return () => {
      viewer.destroy()
      viewerRef.current = null
    }
  }, [panorama]) // re-mount when panorama changes

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}

function PanelInfo({ onClose }: { onClose: () => void }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>InformaciÃ³n General</h3>
        <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}><X size={16} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {[
          { label: 'DirecciÃ³n', value: "Av. Libertador Bernardo O'Higgins 1234" },
          { label: 'TelÃ©fono', value: '+56 2 2345 6789' },
          { label: 'Horario', value: 'Lunâ€“Vie 08:00â€“18:00' },
          { label: 'Responsable', value: 'Juan PÃ©rez' },
          { label: 'Ãšltima visita', value: '12 Ene 2024' },
          { label: 'Espacios 360Â°', value: `${ESPACIOS.length} ambientes cargados` },
        ].map(({ label, value }) => (
          <div key={label} className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <p className="text-xs mb-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function PanelVisita({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ tipo: 'inspecciÃ³n', descripcion: '', prioridad: 'normal' })
  const [sent, setSent] = useState(false)
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))
  const inputStyle = { backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }

  if (sent) return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <CheckCircle size={48} style={{ color: 'var(--accent-green)' }} className="mb-4" />
      <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Â¡Visita registrada!</h3>
      <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>El reporte fue enviado correctamente</p>
      <button onClick={() => { setSent(false); setForm({ tipo: 'inspecciÃ³n', descripcion: '', prioridad: 'normal' }) }}
        className="mt-6 h-9 px-4 rounded-xl text-sm" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
        Nuevo reporte
      </button>
    </div>
  )

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Registrar Visita</h3>
        <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}><X size={16} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Tipo</label>
          <select value={form.tipo} onChange={(e) => set('tipo', e.target.value)}
            className="w-full h-9 px-3 rounded-xl border text-sm outline-none" style={inputStyle}>
            <option value="inspecciÃ³n">InspecciÃ³n</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="emergencia">Emergencia</option>
            <option value="instalaciÃ³n">InstalaciÃ³n</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Prioridad</label>
          <div className="flex gap-2">
            {['baja', 'normal', 'alta', 'urgente'].map((p) => (
              <button key={p} onClick={() => set('prioridad', p)}
                className="flex-1 h-8 rounded-xl text-xs capitalize transition-all"
                style={{
                  backgroundColor: form.prioridad === p
                    ? p === 'urgente' ? 'var(--accent-red)' : p === 'alta' ? 'var(--accent-orange)' : 'var(--accent-blue)'
                    : 'var(--bg-secondary)',
                  color: form.prioridad === p ? 'white' : 'var(--text-secondary)',
                  border: `1px solid ${form.prioridad === p ? 'transparent' : 'var(--border)'}`,
                }}>{p}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>DescripciÃ³n</label>
          <textarea value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)}
            placeholder="Describe el trabajo realizado o los hallazgos..." rows={4}
            className="w-full px-3 py-2 rounded-xl border text-sm outline-none resize-none" style={inputStyle} />
        </div>
        <button onClick={() => setSent(true)}
          className="w-full h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
          style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}>
          <Camera size={16} /> Enviar reporte
        </button>
      </div>
    </div>
  )
}

function PanelPlano({ onClose, espacioIdx }: { onClose: () => void; espacioIdx: number }) {
  const rooms = [
    { x: 20, y: 20, w: 140, h: 90, label: 'Sala Principal', cx: 90, cy: 65 },
    { x: 160, y: 20, w: 120, h: 90, label: 'Reuniones', cx: 220, cy: 65 },
    { x: 20, y: 110, w: 80, h: 90, label: 'Bodega', cx: 60, cy: 155 },
    { x: 100, y: 110, w: 180, h: 90, label: 'RecepciÃ³n', cx: 190, cy: 155 },
  ]
  const dots = [{ x: 90, y: 55 }, { x: 220, y: 55 }, { x: 60, y: 145 }, { x: 190, y: 145 }]

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>PlanimetrÃ­a</h3>
        <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}><X size={16} /></button>
      </div>
      <div className="flex-1 p-4">
        <svg width="100%" viewBox="0 0 300 220" style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px' }}>
          {rooms.map((r, i) => (
            <g key={i}>
              <rect x={r.x} y={r.y} width={r.w} height={r.h}
                fill={i === espacioIdx ? '#4f7cff22' : 'var(--bg-hover)'}
                stroke={i === espacioIdx ? '#4f7cff' : 'var(--border)'}
                strokeWidth={i === espacioIdx ? 2 : 1.5} />
              <text x={r.cx} y={r.cy + 5} textAnchor="middle" fontSize="10" fill="var(--text-secondary)">{r.label}</text>
            </g>
          ))}
          {dots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={i === espacioIdx ? 8 : 6}
              fill={i === espacioIdx ? 'var(--accent-blue)' : '#4f7cff66'} />
          ))}
        </svg>
        <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>
          El punto azul indica el espacio actualmente visualizado.
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
  const espacio = ESPACIOS[espacioIdx]

  const nextEspacio = () => setEspacioIdx((i) => (i + 1) % ESPACIOS.length)
  const prevEspacio = () => setEspacioIdx((i) => (i - 1 + ESPACIOS.length) % ESPACIOS.length)
  const togglePanel = (p: Panel) => setPanel((cur) => (cur === p ? null : p))

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* 360Â° Viewer */}
      <div className="absolute inset-0">
        <PanoramaViewer
          key={espacio.id}
          panorama={espacio.panorama}
          markers={espacio.markers}
        />
      </div>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)', pointerEvents: 'none' }}>
        <button
          onClick={() => navigate('/viewer')}
          className="flex items-center gap-2 h-9 px-3 rounded-xl text-sm"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)', color: 'white', backdropFilter: 'blur(8px)', pointerEvents: 'all' }}
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">{sucursal.nombre}</span>
        </button>
        <div className="flex items-center gap-1.5 h-8 px-3 rounded-xl text-sm"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}>
          <MapPin size={13} style={{ color: '#4f7cff' }} />
          {sucursal.ciudad}
        </div>
      </div>

      {/* Space navigation */}
      <div className="absolute bottom-24 left-0 right-0 flex items-center justify-center gap-3 z-20 px-4">
        <button onClick={prevEspacio}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', backdropFilter: 'blur(8px)' }}>
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-2 h-9 px-4 rounded-full"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <span className="text-sm font-medium text-white">{espacio.nombre}</span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{espacioIdx + 1}/{ESPACIOS.length}</span>
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
            className="rounded-full transition-all"
            style={{
              width: i === espacioIdx ? '20px' : '6px',
              height: '6px',
              backgroundColor: i === espacioIdx ? '#4f7cff' : 'rgba(255,255,255,0.3)',
            }} />
        ))}
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-around px-4 py-3"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)', paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}>
        {([
          { id: 'info' as Panel, icon: Info, label: 'Info' },
          { id: 'visita' as Panel, icon: ClipboardList, label: 'Visita' },
          { id: 'plano' as Panel, icon: FileText, label: 'Plano' },
        ] as const).map(({ id: panelId, icon: Icon, label }) => (
          <button key={panelId} onClick={() => togglePanel(panelId)}
            className="flex flex-col items-center gap-1 w-16 h-14 rounded-xl justify-center transition-all"
            style={{
              backgroundColor: panel === panelId ? '#4f7cff33' : 'rgba(0,0,0,0.5)',
              color: panel === panelId ? '#4f7cff' : 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${panel === panelId ? '#4f7cff44' : 'transparent'}`,
            }}>
            <Icon size={18} />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>

      {/* Side Panel */}
      {panel && (
        <div className="absolute top-0 right-0 bottom-0 w-80 z-30 overflow-hidden"
          style={{ backgroundColor: 'var(--bg-card)', borderLeft: '1px solid var(--border)', backdropFilter: 'blur(16px)' }}>
          {panel === 'info' && <PanelInfo onClose={() => setPanel(null)} />}
          {panel === 'visita' && <PanelVisita onClose={() => setPanel(null)} />}
          {panel === 'plano' && <PanelPlano onClose={() => setPanel(null)} espacioIdx={espacioIdx} />}
        </div>
      )}
    </div>
  )
}
