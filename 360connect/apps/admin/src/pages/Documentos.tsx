import { useState } from 'react'
import { Search, Upload, Download, FileText, Filter, X, Tag, ChevronDown } from 'lucide-react'
import { mockDocumentos } from '../data/mock'

const CATEGORIAS = ['Todas', 'Manual', 'Protocolo', 'Técnico', 'Plano', 'Legal', 'Reporte']

interface Documento {
  id: string
  nombre: string
  categoria: string
  version: string
  tamano: string
  subidoPor: string
  fecha: string
}

const catColor: Record<string, string> = {
  Manual: 'var(--accent-blue)',
  Protocolo: 'var(--accent-orange)',
  Técnico: '#c084fc',
  Plano: 'var(--accent-green)',
  Legal: '#fb923c',
  Reporte: 'var(--accent-blue)',
}

function UploadModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ nombre: '', categoria: 'Manual', version: '1.0', tags: '' })
  const [file, setFile] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(false)

  const handleUpload = () => {
    if (!file) return
    setUploading(true)
    setTimeout(() => { setUploading(false); setDone(true); setTimeout(onClose, 800) }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-md rounded-2xl border p-6 space-y-5" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Subir Documento</h3>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}><X size={18} /></button>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files[0]?.name ?? null) }}
          onClick={() => document.getElementById('doc-input')?.click()}
          className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all"
          style={{ borderColor: dragging ? 'var(--accent-blue)' : 'var(--border)', backgroundColor: dragging ? 'var(--accent-blue)11' : 'var(--bg-secondary)' }}
        >
          <input id="doc-input" type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)} />
          <Upload size={28} className="mx-auto mb-2" style={{ color: file ? 'var(--accent-green)' : 'var(--text-secondary)' }} />
          {file
            ? <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>{file}</p>
            : <><p className="text-sm" style={{ color: 'var(--text-primary)' }}>Arrastrá tu archivo aquí</p><p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>PDF, DOCX, XLSX, DWG · Max 100 MB</p></>
          }
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Nombre del documento *</label>
            <input
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              placeholder="Ej: Manual de Operaciones v4"
              className="w-full h-9 px-3 rounded-lg border text-sm outline-none"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Categoría</label>
            <select
              value={form.categoria}
              onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
              className="w-full h-9 px-3 rounded-lg border text-sm outline-none"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              {CATEGORIAS.filter((c) => c !== 'Todas').map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Versión</label>
            <input
              value={form.version}
              onChange={(e) => setForm((f) => ({ ...f, version: e.target.value }))}
              placeholder="1.0"
              className="w-full h-9 px-3 rounded-lg border text-sm outline-none"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Tags (separados por coma)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              placeholder="mantenimiento, técnico, 2024"
              className="w-full h-9 px-3 rounded-lg border text-sm outline-none"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-9 rounded-lg text-sm border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Cancelar</button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="flex-1 h-9 rounded-lg text-sm font-medium disabled:opacity-40"
            style={{ backgroundColor: done ? 'var(--accent-green)' : 'var(--accent-blue)', color: 'white' }}
          >
            {uploading ? 'Subiendo...' : done ? 'Subido ✓' : 'Subir Documento'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Documentos() {
  const [search, setSearch] = useState('')
  const [categoria, setCategoria] = useState('Todas')
  const [showUpload, setShowUpload] = useState(false)
  const [docs] = useState<Documento[]>(mockDocumentos)

  const filtered = docs.filter((d) => {
    const matchSearch = d.nombre.toLowerCase().includes(search.toLowerCase()) || d.subidoPor.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoria === 'Todas' || d.categoria === categoria
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-6">
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Biblioteca de Documentos</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{filtered.length} documentos</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium hover:opacity-90"
          style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
        >
          <Upload size={15} />
          Subir Documento
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar documentos..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border text-sm outline-none"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
        <div className="flex gap-2">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              className="h-9 px-3 rounded-lg text-sm transition-all"
              style={{
                backgroundColor: categoria === cat ? 'var(--accent-blue)22' : 'var(--bg-card)',
                color: categoria === cat ? 'var(--accent-blue)' : 'var(--text-secondary)',
                border: `1px solid ${categoria === cat ? 'var(--accent-blue)44' : 'var(--border)'}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Documento', 'Categoría', 'Versión', 'Tamaño', 'Subido por', 'Fecha', ''].map((h) => (
                <th key={h} className="text-left text-xs font-medium px-5 py-3" style={{ color: 'var(--text-secondary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc, i) => (
              <tr key={doc.id} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border)' }} className="hover:bg-[var(--bg-hover)] transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: (catColor[doc.categoria] ?? 'var(--accent-blue)') + '22', color: catColor[doc.categoria] ?? 'var(--accent-blue)' }}>
                      <FileText size={15} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{doc.nombre}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className="inline-flex h-6 px-2.5 rounded-full text-xs font-medium items-center"
                    style={{ backgroundColor: (catColor[doc.categoria] ?? 'var(--accent-blue)') + '22', color: catColor[doc.categoria] ?? 'var(--accent-blue)' }}
                  >
                    {doc.categoria}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>v{doc.version}</td>
                <td className="px-5 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{doc.tamano}</td>
                <td className="px-5 py-4 text-sm" style={{ color: 'var(--text-primary)' }}>{doc.subidoPor}</td>
                <td className="px-5 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{doc.fecha}</td>
                <td className="px-5 py-4">
                  <button className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
                    <Download size={13} />
                    Descargar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <FileText size={40} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-secondary)' }} />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No se encontraron documentos</p>
          </div>
        )}
      </div>
    </div>
  )
}
