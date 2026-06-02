import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, ChevronDown, ChevronUp, Image, CheckCircle, Clock, AlertCircle, Filter } from 'lucide-react'
import { mockReportesCampo, mockSucursales } from '../data/mock'
import type { ReporteCampo } from '../types/models'
import { Button, Badge, Dialog } from '../components/ui'

type Tab = 'todos' | 'nuevo' | 'pendiente_revision' | 'revisado'

const TABS: { key: Tab; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'nuevo', label: 'Nuevos' },
  { key: 'pendiente_revision', label: 'Pendiente Revisión' },
  { key: 'revisado', label: 'Revisados' },
]

const tipoBadge = (tipo: string): 'red' | 'blue' => tipo === 'falla' ? 'red' : 'blue'
const tipoLabel: Record<string, string> = { falla: 'Falla', inspeccion: 'Inspección' }

const criticidadBadge = (c: string): 'red' | 'orange' | 'green' | 'gray' => {
  const map: Record<string, 'red' | 'orange' | 'green' | 'gray'> = { alta: 'red', media: 'orange', baja: 'green' }
  return map[c] ?? 'gray'
}

const statusIcon = (status: string) => {
  if (status === 'nuevo') return <AlertCircle size={14} style={{ color: 'var(--accent-red)' }} />
  if (status === 'pendiente_revision') return <Clock size={14} style={{ color: 'var(--accent-orange)' }} />
  return <CheckCircle size={14} style={{ color: 'var(--accent-green)' }} />
}

const statusLabel: Record<string, string> = {
  nuevo: 'Nuevo',
  pendiente_revision: 'Pendiente revisión',
  revisado: 'Revisado',
}

const FILTER_TIPO = ['todos', 'falla', 'inspeccion']
const EMPTY_FORM = { tipo: 'inspeccion', criticidad: 'baja', descripcion: '' }

export default function Informes() {
  const { id } = useParams<{ id: string }>()
  const sucursal = mockSucursales.find((s) => s.id === id)

  const [items, setItems] = useState<ReporteCampo[]>(
    mockReportesCampo.filter((i) => i.sucursalId === id)
  )
  const [tab, setTab] = useState<Tab>('todos')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [filtroTipo, setFiltroTipo] = useState('todos')

  const filtered = items.filter((i) => {
    const matchTab = tab === 'todos' || i.status === tab
    const matchTipo = filtroTipo === 'todos' || i.tipo === filtroTipo
    return matchTab && matchTipo
  })

  const handleSave = () => {
    if (!form.descripcion) return
    const newItem: ReporteCampo = {
      id: String(Date.now()),
      sucursalId: id!,
      tecnicoId: '1',
      tecnicoNombre: 'María González',
      tipo: form.tipo,
      criticidad: form.criticidad,
      descripcion: form.descripcion,
      status: 'nuevo',
      fotosKeys: [],
      creadoEn: new Date().toISOString().slice(0, 16).replace('T', ' '),
    }
    setItems((prev) => [newItem, ...prev])
    setDialogOpen(false)
    setForm({ ...EMPTY_FORM })
  }

  const updateStatus = (itemId: string, newStatus: string) => {
    setItems((prev) => prev.map((i) => i.id === itemId ? { ...i, status: newStatus } : i))
  }

  const countByTab = (t: Tab) => t === 'todos' ? items.length : items.filter((i) => i.status === t).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Inspecciones e Informes</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{sucursal?.nombre ?? `Sucursal ${id}`}</p>
        </div>
        <Button onClick={() => { setForm({ ...EMPTY_FORM }); setDialogOpen(true) }}><Plus size={16} />Nuevo Informe</Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        {TABS.map((t) => {
          const count = countByTab(t.key)
          const active = tab === t.key
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center"
              style={{
                backgroundColor: active ? 'var(--bg-hover)' : 'transparent',
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              {t.label}
              {count > 0 && (
                <span
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: active ? 'var(--accent-blue)' : 'var(--bg-hover)',
                    color: active ? 'white' : 'var(--text-secondary)',
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Filter size={15} style={{ color: 'var(--text-secondary)' }} />
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="h-9 px-3 rounded-lg border text-sm outline-none"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        >
          {FILTER_TIPO.map((t) => (
            <option key={t} value={t}>{t === 'todos' ? 'Todos los tipos' : tipoLabel[t] ?? t}</option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <AlertCircle size={40} className="mx-auto mb-3 opacity-20" style={{ color: 'var(--text-secondary)' }} />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No hay informes en esta categoría</p>
          </div>
        ) : (
          filtered.map((item, i) => {
            const isExpanded = expanded === item.id
            return (
              <div key={item.id} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                  onClick={() => setExpanded(isExpanded ? null : item.id)}
                >
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {statusIcon(item.status)}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={tipoBadge(item.tipo)}>{tipoLabel[item.tipo] ?? item.tipo}</Badge>
                    {item.status === 'nuevo' && (
                      <span
                        className="inline-flex items-center h-5 px-2 rounded-full text-xs font-bold animate-pulse-dot"
                        style={{ backgroundColor: 'var(--accent-red)33', color: 'var(--accent-red)' }}
                      >
                        NUEVO
                      </span>
                    )}
                  </div>

                  <Badge variant={criticidadBadge(item.criticidad)}>
                    {item.criticidad.charAt(0).toUpperCase() + item.criticidad.slice(1)}
                  </Badge>

                  <p className="flex-1 text-sm truncate" style={{ color: 'var(--text-primary)' }}>{item.descripcion}</p>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.tecnicoNombre}</span>
                    {item.fotosKeys.length > 0 && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <Image size={12} />{item.fotosKeys.length}
                      </span>
                    )}
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.creadoEn}</span>
                    {isExpanded ? <ChevronUp size={16} style={{ color: 'var(--text-secondary)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} />}
                  </div>
                </div>

                {isExpanded && (
                  <div
                    className="px-5 pb-5 animate-fade-in"
                    style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <p className="text-sm pt-4 mb-4 leading-relaxed" style={{ color: 'var(--text-primary)' }}>{item.descripcion}</p>
                    {item.revisadoPor && (
                      <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                        Revisado por: <span style={{ color: 'var(--text-primary)' }}>{item.revisadoPor}</span>
                      </p>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Cambiar estado:</span>
                      {item.status !== 'pendiente_revision' && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(item.id, 'pendiente_revision')}>
                          <Clock size={12} /> Marcar Pendiente
                        </Button>
                      )}
                      {item.status !== 'revisado' && (
                        <Button size="sm" variant="secondary" onClick={() => updateStatus(item.id, 'revisado')}>
                          <CheckCircle size={12} /> Marcar Revisado
                        </Button>
                      )}
                      {item.status !== 'nuevo' && (
                        <Button size="sm" variant="ghost" onClick={() => updateStatus(item.id, 'nuevo')}>
                          <AlertCircle size={12} /> Reabrir
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Nuevo Informe de Campo"
        footer={
          <>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.descripcion}>Guardar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Tipo</label>
              <select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                className="h-10 px-3 rounded-lg border text-sm outline-none"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              >
                <option value="inspeccion">Inspección</option>
                <option value="falla">Falla</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Criticidad</label>
              <select
                value={form.criticidad}
                onChange={(e) => setForm({ ...form, criticidad: e.target.value })}
                className="h-10 px-3 rounded-lg border text-sm outline-none"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Descripción *</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              rows={4}
              placeholder="Describa la observación o falla..."
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}