import { useState, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, History, Save, Upload, MapPin, Trash2, Move, ZoomIn, ZoomOut } from 'lucide-react'
import { mockSucursales, mockEspacios } from '../data/mock'

interface Marker {
  id: string
  x: number
  y: number
  espacioId: string
  label: string
}

const INITIAL_MARKERS: Marker[] = [
  { id: 'm1', x: 30, y: 40, espacioId: '1', label: 'Sala Principal' },
  { id: 'm2', x: 60, y: 60, espacioId: '2', label: 'Sala de Reuniones' },
  { id: 'm3', x: 75, y: 30, espacioId: '3', label: 'Bodega' },
]

export default function Planimetria() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const sucursal = mockSucursales.find((s) => s.id === id)
  const espacios = mockEspacios.filter((e) => e.sucursalId === id)

  const [markers, setMarkers] = useState<Marker[]>(INITIAL_MARKERS)
  const [selected, setSelected] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [tool, setTool] = useState<'select' | 'add'>('select')
  const [planoUrl, setPlanoUrl] = useState<string | null>(null)
  const [zoom, setZoom] = useState(100)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveComment, setSaveComment] = useState('')
  const [saved, setSaved] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPlanoUrl(url)
    // reset input so same file can be re-selected
    e.target.value = ''
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tool !== 'add') return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    const espacio = espacios[markers.length % espacios.length]
    const newMarker: Marker = {
      id: `m${Date.now()}`,
      x,
      y,
      espacioId: espacio?.id ?? '?',
      label: espacio?.nombre ?? 'Espacio',
    }
    setMarkers((prev) => [...prev, newMarker])
    setTool('select')
  }

  const handleMarkerDrag = (markerId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const canvas = canvasRef.current
    if (!canvas) return

    const startX = e.clientX
    const startY = e.clientY
    const marker = markers.find((m) => m.id === markerId)
    if (!marker) return
    const origX = marker.x
    const origY = marker.y

    const onMove = (ev: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const dx = ((ev.clientX - startX) / rect.width) * 100
      const dy = ((ev.clientY - startY) / rect.height) * 100
      setMarkers((prev) =>
        prev.map((m) => m.id === markerId
          ? { ...m, x: Math.max(2, Math.min(98, origX + dx)), y: Math.max(2, Math.min(98, origY + dy)) }
          : m
        )
      )
    }
    const onUp = () => {
      setDraggingId(null)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    setDraggingId(markerId)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const handleSave = () => {
    if (!saveComment.trim()) return
    setSaved(true)
    setShowSaveModal(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const selectedMarker = markers.find((m) => m.id === selected)

  return (
    <div className="flex flex-col h-full" style={{ height: 'calc(100vh - 130px)' }}>
      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-sm rounded-2xl border p-6 space-y-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Guardar nueva versión</h3>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Comentario de versión *
              </label>
              <textarea
                rows={3}
                value={saveComment}
                onChange={(e) => setSaveComment(e.target.value)}
                placeholder="Ej: Ajuste marcadores sala principal..."
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowSaveModal(false)} className="flex-1 h-9 rounded-lg text-sm border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!saveComment.trim()}
                className="flex-1 h-9 rounded-lg text-sm font-medium disabled:opacity-40"
                style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
              >
                Guardar Versión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
        <button
          onClick={() => navigate('/sucursales')}
          className="p-2 rounded-lg hover:opacity-80"
          style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-card)' }}
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Editor de Planimetría — {sucursal?.nombre}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {markers.length} marcadores · Hacé clic en el canvas para añadir
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-sm px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--accent-green)22', color: 'var(--accent-green)' }}>
              ✓ Guardado
            </span>
          )}
          <Link
            to={`/sucursales/${id}/planimetria/historial`}
            className="flex items-center gap-2 h-9 px-3 rounded-lg text-sm border"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            <History size={15} />
            Historial
          </Link>
          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium hover:opacity-90"
            style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
          >
            <Save size={15} />
            Guardar Versión
          </button>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Toolbar */}
        <div className="flex flex-col gap-2 w-56 flex-shrink-0">
          <div className="rounded-xl border p-4 space-y-3" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Herramientas</p>
            <div className="space-y-2">
              <button
                onClick={() => setTool('select')}
                className="w-full flex items-center gap-2 h-9 px-3 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: tool === 'select' ? 'var(--accent-blue)22' : 'var(--bg-secondary)',
                  color: tool === 'select' ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  border: `1px solid ${tool === 'select' ? 'var(--accent-blue)44' : 'var(--border)'}`,
                }}
              >
                <Move size={15} />
                Seleccionar / Mover
              </button>
              <button
                onClick={() => setTool('add')}
                className="w-full flex items-center gap-2 h-9 px-3 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: tool === 'add' ? 'var(--accent-green)22' : 'var(--bg-secondary)',
                  color: tool === 'add' ? 'var(--accent-green)' : 'var(--text-secondary)',
                  border: `1px solid ${tool === 'add' ? 'var(--accent-green)44' : 'var(--border)'}`,
                }}
              >
                <MapPin size={15} />
                Añadir Marcador
              </button>
            </div>

            <div className="border-t pt-3" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-secondary)' }}>Zoom</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setZoom((z) => Math.max(50, z - 10))} className="p-1.5 rounded-lg" style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)' }}>
                  <ZoomOut size={14} />
                </button>
                <span className="flex-1 text-center text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{zoom}%</span>
                <button onClick={() => setZoom((z) => Math.min(200, z + 10))} className="p-1.5 rounded-lg" style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)' }}>
                  <ZoomIn size={14} />
                </button>
              </div>
            </div>

            <div className="border-t pt-3" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-secondary)' }}>Plano Base</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 h-9 px-3 rounded-lg text-sm transition-all"
                style={{
                  borderColor: planoUrl ? 'var(--accent-green)44' : 'var(--border)',
                  border: `1px dashed ${planoUrl ? 'var(--accent-green)' : 'var(--border)'}`,
                  color: planoUrl ? 'var(--accent-green)' : 'var(--text-secondary)',
                  backgroundColor: planoUrl ? 'var(--accent-green)11' : 'transparent',
                }}
              >
                <Upload size={14} />
                {planoUrl ? 'Cambiar imagen' : 'Subir Plano Base'}
              </button>
              {planoUrl && (
                <button
                  onClick={() => setPlanoUrl(null)}
                  className="w-full mt-1.5 flex items-center justify-center gap-2 h-7 px-3 rounded-lg text-xs"
                  style={{ color: 'var(--accent-red)', backgroundColor: 'var(--accent-red)11' }}
                >
                  <Trash2 size={12} /> Quitar imagen
                </button>
              )}
            </div>
          </div>

          {/* Selected marker info */}
          {selectedMarker && (
            <div className="rounded-xl border p-4 space-y-3" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--accent-blue)44' }}>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--accent-blue)' }}>Marcador Seleccionado</p>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{selectedMarker.label}</p>
                <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--text-secondary)' }}>
                  X: {selectedMarker.x.toFixed(1)}% · Y: {selectedMarker.y.toFixed(1)}%
                </p>
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Asignar espacio</label>
                <select
                  value={selectedMarker.espacioId}
                  onChange={(e) => setMarkers((prev) => prev.map((m) => m.id === selected ? { ...m, espacioId: e.target.value, label: espacios.find((es) => es.id === e.target.value)?.nombre ?? m.label } : m))}
                  className="w-full h-8 px-2 rounded-lg border text-xs outline-none"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                >
                  {espacios.map((esp) => <option key={esp.id} value={esp.id}>{esp.nombre}</option>)}
                </select>
              </div>
              <button
                onClick={() => { setMarkers((prev) => prev.filter((m) => m.id !== selected)); setSelected(null) }}
                className="w-full flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs"
                style={{ backgroundColor: 'var(--accent-red)22', color: 'var(--accent-red)' }}
              >
                <Trash2 size={13} />
                Eliminar Marcador
              </button>
            </div>
          )}

          {/* Espacios list */}
          <div className="rounded-xl border p-4 space-y-2" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Espacios ({espacios.length})</p>
            {espacios.map((esp) => {
              const linked = markers.some((m) => m.espacioId === esp.id)
              return (
                <div key={esp.id} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: linked ? 'var(--accent-green)' : 'var(--border)' }}
                  />
                  <span className="text-xs truncate" style={{ color: 'var(--text-primary)' }}>{esp.nombre}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Canvas area */}
        <div className="flex-1 rounded-xl border overflow-hidden relative" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
          {planoUrl ? (
            <div
              ref={canvasRef}
              className="relative w-full h-full overflow-hidden"
              style={{ cursor: tool === 'add' ? 'crosshair' : 'default' }}
              onClick={handleCanvasClick}
            >
              {/* Real floor plan image */}
              <img
                src={planoUrl}
                alt="Plano base"
                className="absolute inset-0 w-full h-full"
                style={{
                  objectFit: 'contain',
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'center center',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
                draggable={false}
              />

              {/* Markers */}
              {markers.map((marker) => (
                <div
                  key={marker.id}
                  className="absolute group"
                  style={{
                    left: `${marker.x}%`,
                    top: `${marker.y}%`,
                    transform: 'translate(-50%, -100%)',
                    cursor: draggingId === marker.id ? 'grabbing' : 'grab',
                    zIndex: selected === marker.id ? 10 : 5,
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    setSelected(marker.id)
                    if (tool === 'select') handleMarkerDrag(marker.id, e)
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className="px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap shadow-lg mb-1 opacity-0 group-hover:opacity-100 transition-all"
                      style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                    >
                      {marker.label}
                    </div>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all"
                      style={{
                        backgroundColor: selected === marker.id ? 'var(--accent-blue)' : '#4f7cff88',
                        border: `2px solid ${selected === marker.id ? 'white' : 'var(--accent-blue)'}`,
                      }}
                    >
                      <MapPin size={14} style={{ color: 'white' }} />
                    </div>
                  </div>
                </div>
              ))}

              {tool === 'add' && (
                <div
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: 'var(--accent-green)22', color: 'var(--accent-green)', border: '1px solid var(--accent-green)44' }}
                >
                  Hacé clic en el plano para añadir marcador
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Simulated SVG placeholder + markers */}
              <div
                ref={canvasRef}
                className="relative w-full h-full overflow-hidden"
                style={{ cursor: tool === 'add' ? 'crosshair' : 'default' }}
                onClick={handleCanvasClick}
              >
                <svg
                  className="absolute inset-0 w-full h-full"
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}
                >
                  <rect width="100%" height="100%" fill="#1a1d27" />
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2e3150" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <rect x="10%" y="10%" width="80%" height="80%" fill="none" stroke="#3a3f60" strokeWidth="2" rx="4" />
                  <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#3a3f60" strokeWidth="1" strokeDasharray="4,4" />
                  <line x1="45%" y1="10%" x2="45%" y2="90%" stroke="#3a3f60" strokeWidth="1" strokeDasharray="4,4" />
                  <text x="25%" y="35%" fill="#4a5080" fontSize="12" textAnchor="middle" dominantBaseline="middle">Zona A</text>
                  <text x="70%" y="35%" fill="#4a5080" fontSize="12" textAnchor="middle" dominantBaseline="middle">Zona B</text>
                  <text x="25%" y="70%" fill="#4a5080" fontSize="12" textAnchor="middle" dominantBaseline="middle">Zona C</text>
                  <text x="70%" y="70%" fill="#4a5080" fontSize="12" textAnchor="middle" dominantBaseline="middle">Zona D</text>
                </svg>

                {/* Upload overlay hint */}
                <div
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs cursor-pointer hover:opacity-80 transition-all"
                  style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                >
                  <Upload size={12} />
                  Subir imagen real
                </div>

                {markers.map((marker) => (
                  <div
                    key={marker.id}
                    className="absolute group"
                    style={{
                      left: `${marker.x}%`,
                      top: `${marker.y}%`,
                      transform: 'translate(-50%, -100%)',
                      cursor: draggingId === marker.id ? 'grabbing' : 'grab',
                      zIndex: selected === marker.id ? 10 : 5,
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      setSelected(marker.id)
                      if (tool === 'select') handleMarkerDrag(marker.id, e)
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className="px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap shadow-lg mb-1 opacity-0 group-hover:opacity-100 transition-all"
                        style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                      >
                        {marker.label}
                      </div>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all"
                        style={{
                          backgroundColor: selected === marker.id ? 'var(--accent-blue)' : '#4f7cff88',
                          border: `2px solid ${selected === marker.id ? 'white' : 'var(--accent-blue)'}`,
                        }}
                      >
                        <MapPin size={14} style={{ color: 'white' }} />
                      </div>
                    </div>
                  </div>
                ))}

                {tool === 'add' && (
                  <div
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-sm font-medium"
                    style={{ backgroundColor: 'var(--accent-green)22', color: 'var(--accent-green)', border: '1px solid var(--accent-green)44' }}
                  >
                    Hacé clic en el plano para añadir marcador
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
