import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Search, Edit3, Trash2, Radio } from 'lucide-react'
import { mockTorres, mockSucursales } from '../data/mock'
import { Button, Badge, DataTable, Dialog, Input } from '../components/ui'

interface Torre {
  id: string
  sucursalId: string
  nombre: string
  tipo: string
  altura: string
  estado: string
  ultimaInspeccion: string
  operador: string
  observacion: string
}

const estadoBadge = (estado: string): 'green' | 'yellow' | 'gray' => {
  const map: Record<string, 'green' | 'yellow' | 'gray'> = {
    operativo: 'green',
    mantenimiento: 'yellow',
  }
  return map[estado] ?? 'gray'
}

const estadoLabel: Record<string, string> = {
  operativo: 'Operativo',
  mantenimiento: 'Mantenimiento',
}

const EMPTY_FORM = { nombre: '', tipo: 'Autosoportada', altura: '', estado: 'operativo', ultimaInspeccion: '', operador: '', observacion: '' }

export default function Torres() {
  const { id } = useParams<{ id: string }>()
  const sucursal = mockSucursales.find((s) => s.id === id)

  const [items, setItems] = useState<Torre[]>(
    mockTorres.filter((t) => t.sucursalId === id)
  )
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Torre | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = items.filter(
    (t) =>
      t.nombre.toLowerCase().includes(search.toLowerCase()) ||
      t.tipo.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditing(null)
    setForm({ ...EMPTY_FORM })
    setDialogOpen(true)
  }

  const openEdit = (item: Torre) => {
    setEditing(item)
    setForm({ nombre: item.nombre, tipo: item.tipo, altura: item.altura, estado: item.estado, ultimaInspeccion: item.ultimaInspeccion, operador: item.operador, observacion: item.observacion })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!form.nombre) return
    if (editing) {
      setItems((prev) => prev.map((t) => t.id === editing.id ? { ...t, ...form } : t))
    } else {
      setItems((prev) => [...prev, { id: String(Date.now()), sucursalId: id!, ...form }])
    }
    setDialogOpen(false)
  }

  const handleDelete = (itemId: string) => {
    setItems((prev) => prev.filter((t) => t.id !== itemId))
    setDeleteId(null)
  }

  const columns = [
    { key: 'nombre', label: 'Nombre', render: (row: Record<string, unknown>) => (
      <div className="flex items-center gap-2">
        <Radio size={14} style={{ color: 'var(--accent-orange)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{String(row.nombre)}</span>
      </div>
    )},
    { key: 'tipo', label: 'Tipo', render: (row: Record<string, unknown>) => (
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{String(row.tipo)}</span>
    )},
    { key: 'altura', label: 'Altura', render: (row: Record<string, unknown>) => (
      <span className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{String(row.altura)}</span>
    )},
    { key: 'estado', label: 'Estado', render: (row: Record<string, unknown>) => (
      <Badge variant={estadoBadge(String(row.estado))}>{estadoLabel[String(row.estado)] ?? String(row.estado)}</Badge>
    )},
    { key: 'ultimaInspeccion', label: 'Última Inspección', render: (row: Record<string, unknown>) => (
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{String(row.ultimaInspeccion)}</span>
    )},
    { key: 'operador', label: 'Operador', render: (row: Record<string, unknown>) => (
      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{String(row.operador)}</span>
    )},
    { key: 'observacion', label: 'Observación', render: (row: Record<string, unknown>) => (
      <span className="text-sm truncate max-w-32 block" style={{ color: 'var(--text-secondary)' }}>{String(row.observacion) || '—'}</span>
    )},
    { key: 'acciones', label: 'Acciones', render: (row: Record<string, unknown>) => {
      const item = row as unknown as Torre
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
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Gestión de Torres</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{sucursal?.nombre ?? `Sucursal ${id}`}</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} />Nueva Torre</Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar torre o tipo..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border text-sm outline-none"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      <DataTable columns={columns} data={filtered as unknown as Record<string, unknown>[]} emptyMessage="No hay torres registradas" />

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editing ? 'Editar Torre' : 'Nueva Torre'}
        footer={
          <>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.nombre}>Guardar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nombre *" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Torre Principal" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Tipo</label>
            <select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              className="h-10 px-3 rounded-lg border text-sm outline-none"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              <option>Autosoportada</option>
              <option>Monopolo</option>
              <option>Mástil</option>
              <option>Triangular</option>
            </select>
          </div>
          <Input label="Altura" value={form.altura} onChange={(e) => setForm({ ...form, altura: e.target.value })} placeholder="Ej: 30m" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Estado</label>
            <select
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
              className="h-10 px-3 rounded-lg border text-sm outline-none"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              <option value="operativo">Operativo</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>
          </div>
          <Input label="Última Inspección" type="date" value={form.ultimaInspeccion} onChange={(e) => setForm({ ...form, ultimaInspeccion: e.target.value })} />
          <Input label="Operador" value={form.operador} onChange={(e) => setForm({ ...form, operador: e.target.value })} placeholder="Ej: Claro" />
          <Input label="Observación" value={form.observacion} onChange={(e) => setForm({ ...form, observacion: e.target.value })} placeholder="Opcional" />
        </div>
      </Dialog>
    </div>
  )
}
