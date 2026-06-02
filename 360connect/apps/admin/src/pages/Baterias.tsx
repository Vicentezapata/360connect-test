import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Search, Edit3, Trash2, Battery, AlertTriangle } from 'lucide-react'
import { mockBaterias, mockSucursales } from '../data/mock'
import { Button, Badge, DataTable, Dialog, Input } from '../components/ui'

interface Bateria {
  id: string
  sucursalId: string
  nombre: string
  modelo: string
  capacidad: string
  estado: string
  ultimaRevision: string
  autonomia: string
  observacion: string
}

const estadoBadge = (estado: string): 'green' | 'orange' | 'red' | 'gray' => {
  const map: Record<string, 'green' | 'orange' | 'red' | 'gray'> = {
    bueno: 'green',
    regular: 'orange',
    critico: 'red',
  }
  return map[estado] ?? 'gray'
}

const estadoLabel: Record<string, string> = {
  bueno: 'Bueno',
  regular: 'Regular',
  critico: 'Crítico',
}

const EMPTY_FORM = { nombre: '', modelo: '', capacidad: '', estado: 'bueno', ultimaRevision: '', autonomia: '', observacion: '' }

export default function Baterias() {
  const { id } = useParams<{ id: string }>()
  const sucursal = mockSucursales.find((s) => s.id === id)

  const [items, setItems] = useState<Bateria[]>(
    mockBaterias.filter((b) => b.sucursalId === id)
  )
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Bateria | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = items.filter(
    (b) =>
      b.nombre.toLowerCase().includes(search.toLowerCase()) ||
      b.modelo.toLowerCase().includes(search.toLowerCase())
  )

  const hasCritico = items.some((b) => b.estado === 'critico')

  const openAdd = () => {
    setEditing(null)
    setForm({ ...EMPTY_FORM })
    setDialogOpen(true)
  }

  const openEdit = (item: Bateria) => {
    setEditing(item)
    setForm({ nombre: item.nombre, modelo: item.modelo, capacidad: item.capacidad, estado: item.estado, ultimaRevision: item.ultimaRevision, autonomia: item.autonomia, observacion: item.observacion })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!form.nombre || !form.modelo) return
    if (editing) {
      setItems((prev) => prev.map((b) => b.id === editing.id ? { ...b, ...form } : b))
    } else {
      setItems((prev) => [...prev, { id: String(Date.now()), sucursalId: id!, ...form }])
    }
    setDialogOpen(false)
  }

  const handleDelete = (itemId: string) => {
    setItems((prev) => prev.filter((b) => b.id !== itemId))
    setDeleteId(null)
  }

  const columns = [
    { key: 'nombre', label: 'Nombre', render: (row: Record<string, unknown>) => (
      <div className="flex items-center gap-2">
        <Battery size={14} style={{ color: 'var(--accent-green)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{String(row.nombre)}</span>
      </div>
    )},
    { key: 'modelo', label: 'Modelo', render: (row: Record<string, unknown>) => (
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{String(row.modelo)}</span>
    )},
    { key: 'capacidad', label: 'Capacidad', render: (row: Record<string, unknown>) => (
      <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>{String(row.capacidad)}</span>
    )},
    { key: 'estado', label: 'Estado', render: (row: Record<string, unknown>) => (
      <Badge variant={estadoBadge(String(row.estado))}>{estadoLabel[String(row.estado)] ?? String(row.estado)}</Badge>
    )},
    { key: 'ultimaRevision', label: 'Última Revisión', render: (row: Record<string, unknown>) => (
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{String(row.ultimaRevision)}</span>
    )},
    { key: 'autonomia', label: 'Autonomía', render: (row: Record<string, unknown>) => (
      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{String(row.autonomia)}</span>
    )},
    { key: 'observacion', label: 'Observación', render: (row: Record<string, unknown>) => (
      <span className="text-sm truncate max-w-32 block" style={{ color: 'var(--text-secondary)' }}>{String(row.observacion) || '—'}</span>
    )},
    { key: 'acciones', label: 'Acciones', render: (row: Record<string, unknown>) => {
      const item = row as unknown as Bateria
      if (deleteId === item.id) {
        return (
          <div className="flex items-center gap-1">
            <span className="text-xs mr-1" style={{ color: 'var(--accent-red)' }}>¿Eliminar?</span>
            <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>Sí</Button>
            <Button size="sm" variant="outline" onClick={() => setDeleteId(null)}>No</Button>
          </div>
        )
      }
      return (
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={() => openEdit(item)}><Edit3 size={13} /></Button>
          <Button size="sm" variant="ghost" onClick={() => setDeleteId(item.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={13} /></Button>
        </div>
      )
    }},
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Gestión de Baterías</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{sucursal?.nombre ?? `Sucursal ${id}`}</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} />Nueva Batería</Button>
      </div>

      {hasCritico && (
        <div
          className="flex items-center gap-3 p-4 rounded-xl border"
          style={{ backgroundColor: 'var(--accent-red)11', borderColor: 'var(--accent-red)44', color: 'var(--accent-red)' }}
        >
          <AlertTriangle size={18} />
          <div>
            <p className="text-sm font-semibold">Alerta: Batería en estado crítico</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Una o más baterías requieren atención inmediata o reemplazo.</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar batería o modelo..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border text-sm outline-none"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      <DataTable columns={columns} data={filtered as unknown as Record<string, unknown>[]} emptyMessage="No hay baterías registradas" />

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editing ? 'Editar Batería' : 'Nueva Batería'}
        footer={
          <>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.nombre || !form.modelo}>Guardar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nombre *" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Batería UPS Principal" />
          <Input label="Modelo *" value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} placeholder="Ej: APC Smart-UPS 3000" />
          <Input label="Capacidad" value={form.capacidad} onChange={(e) => setForm({ ...form, capacidad: e.target.value })} placeholder="Ej: 3000 VA" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Estado</label>
            <select
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
              className="h-10 px-3 rounded-lg border text-sm outline-none"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              <option value="bueno">Bueno</option>
              <option value="regular">Regular</option>
              <option value="critico">Crítico</option>
            </select>
          </div>
          <Input label="Última Revisión" type="date" value={form.ultimaRevision} onChange={(e) => setForm({ ...form, ultimaRevision: e.target.value })} />
          <Input label="Autonomía" value={form.autonomia} onChange={(e) => setForm({ ...form, autonomia: e.target.value })} placeholder="Ej: 45 min" />
          <Input label="Observación" value={form.observacion} onChange={(e) => setForm({ ...form, observacion: e.target.value })} placeholder="Opcional" />
        </div>
      </Dialog>
    </div>
  )
}
