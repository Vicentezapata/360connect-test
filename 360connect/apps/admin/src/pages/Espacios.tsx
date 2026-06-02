import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Camera, Trash2, GripVertical, Edit3, X, Upload, Map } from 'lucide-react'
import { mockSucursales, mockEspacios } from '../data/mock'

interface Espacio {
  id: string
  nombre: string
  orden: number
  sucursalId: string
  foto?: string
}

const GRADIENT_COLORS = [
  'linear-gradient(135deg, #1a1d4e 0%, #0f1117 100%)',
  'linear-gradient(135deg, #1a2e1a 0%, #0f1117 100%)',
  'linear-gradient(135deg, #2e1a1a 0%, #0f1117 100%)',
  'linear-gradient(135deg, #1a2434 0%, #0f1117 100%)',
]

function UploadModal({ onClose, onSave }: { onClose: () => void; onSave: (nombre: string) => void }) {
  const [nombre, setNombre] = useState('')
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const simulateUpload = () => {
    if (!file || !nombre) return
    let p = 0
    const interval = setInterval(() => {
      p += 10
      setProgress(p)
      if (p >= 100) {
        clearInterval(interval)
        setTimeout(() => onSave(nombre), 400)
      }
    }, 100)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div
        className="w-full max-w-md rounded-2xl border p-6 space-y-5"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Nuevo Espacio 360°</h3>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}><X size={18} /></button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Nombre del espacio *</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Sala Principal"
            className="w-full h-10 px-3 rounded-lg border text-sm outline-none"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            setFile(e.dataTransfer.files[0]?.name ?? null)
          }}
          className="border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer"
          style={{
            borderColor: dragging ? 'var(--accent-blue)' : 'var(--border)',
            backgroundColor: dragging ? 'var(--accent-blue)11' : 'var(--bg-secondary)',
          }}
          onClick={() => document.getElementById('file-input-360')?.click()}
        >
          <input
            id="file-input-360"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)}
          />
          <Upload size={32} className="mx-auto mb-3" style={{ color: file ? 'var(--accent-green)' : 'var(--text-secondary)' }} />
          {file ? (
            <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>{file}</p>
          ) : (
            <>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Arrastrá tu foto 360° aquí</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>PNG, JPG · Mínimo 4096×2048 px · Max 50 MB</p>
            </>
          )}
        </div>

        {progress > 0 && progress < 100 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span>Subiendo...</span><span>{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-hover)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: 'var(--accent-blue)' }} />
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-9 rounded-lg text-sm border transition-all"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            Cancelar
          </button>
          <button
            onClick={simulateUpload}
            disabled={!file || !nombre}
            className="flex-1 h-9 rounded-lg text-sm font-medium transition-all hover:opacity-90 disabled:opacity-40"
            style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
          >
            Subir Foto
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Espacios() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const sucursal = mockSucursales.find((s) => s.id === id)
  const [espacios, setEspacios] = useState<Espacio[]>(
    mockEspacios.filter((e) => e.sucursalId === id)
  )
  const [showUpload, setShowUpload] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)

  const addEspacio = (nombre: string) => {
    const newEsp: Espacio = {
      id: String(Date.now()),
      nombre,
      orden: espacios.length + 1,
      sucursalId: id!,
    }
    setEspacios((prev) => [...prev, newEsp])
    setShowUpload(false)
  }

  const deleteEspacio = (espId: string) => {
    setEspacios((prev) => prev.filter((e) => e.id !== espId))
  }

  return (
    <div className="space-y-6">
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSave={addEspacio} />}

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/sucursales')}
          className="p-2 rounded-lg transition-all hover:opacity-80"
          style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-card)' }}
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Espacios 360° — {sucursal?.nombre ?? `Sucursal ${id}`}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {espacios.length} espacio{espacios.length !== 1 ? 's' : ''} · Arrastrá las tarjetas para reordenar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/sucursales/${id}/planimetria`}
            className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium border transition-all hover:opacity-80"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            <Map size={15} />
            Planimetría
          </Link>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
          >
            <Plus size={16} />
            Nuevo Espacio
          </button>
        </div>
      </div>

      {/* Grid */}
      {espacios.length === 0 ? (
        <div
          className="rounded-xl border py-20 text-center"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <Camera size={48} className="mx-auto mb-4 opacity-20" style={{ color: 'var(--text-secondary)' }} />
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Sin espacios aún</p>
          <p className="text-sm mt-1 mb-6" style={{ color: 'var(--text-secondary)' }}>Añadí el primer espacio 360° de esta sucursal</p>
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 h-9 px-5 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
          >
            <Plus size={15} />
            Agregar Espacio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {espacios.map((esp, idx) => (
            <div
              key={esp.id}
              draggable
              onDragStart={() => setDragIdx(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIdx === null || dragIdx === idx) return
                const reordered = [...espacios]
                const [moved] = reordered.splice(dragIdx, 1)
                reordered.splice(idx, 0, moved)
                setEspacios(reordered.map((e, i) => ({ ...e, orden: i + 1 })))
                setDragIdx(null)
              }}
              className="rounded-xl border overflow-hidden group cursor-grab active:cursor-grabbing transition-all hover:border-[var(--accent-blue)]"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              {/* Photo area */}
              <div
                className="h-36 relative flex items-center justify-center"
                style={{ background: GRADIENT_COLORS[idx % GRADIENT_COLORS.length] }}
              >
                <Camera size={32} className="opacity-20" style={{ color: 'var(--text-primary)' }} />
                <div
                  className="absolute top-2 left-2 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
                >
                  {esp.orden}
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all">
                  <GripVertical size={18} style={{ color: 'var(--text-secondary)' }} />
                </div>
                <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)' }}
                    title="Editar"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => deleteEspacio(esp.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--accent-red)22', color: 'var(--accent-red)' }}
                    title="Eliminar"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{esp.nombre}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Espacio #{esp.orden}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
