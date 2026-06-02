import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Search, Edit3, Trash2, Wifi } from 'lucide-react'
import { mockComunicaciones, mockSucursales } from '../data/mock'
import { Button, Badge, DataTable, Dialog, Input } from '../components/ui'

interface Comunicacion {
  id: string
  sucursalId: string
  enlace: string
  proveedor: string
  estado: string
  capacidad: string
  ip: string
  observacion: string
}

const estadoBadge = (estado: string) => {
  const map: Record<string, 'green' | 'purple' | 'red' | 'gray'> = {
    activo: 'green',
    standby: 'purple',
    falla: 'red',
  }
  return map[estado] ?? 'gray'
}

const estadoLabel: Record<string, string> = {
  activo: 'Activo',
  standby: 'Standby',
  falla: 'Falla',
}

const EMPTY_FORM = { enlace: '', proveedor: '', estado: 'activo', capacidad: '', ip: '', observacion: '' }

export default function Comunicaciones() {
  const { id } = useParams<{ id: string }>()
  const sucursal = mockSucursales.find((s) => s.id === id)

  const [items, setItems] = useState<Comunicacion[]>(
    mockComunicaciones.filter((c) => c.sucursalId === id)
  )
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Comunicacion | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = items.filter(
    (c) =>
      c.enlace.toLowerCase().includes(search.toLowerCase()) ||
      c.proveedor.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditing(null)
    setForm({ ...EMPTY_FORM })
    setDialogOpen(true)
  }

  const openEdit = (item: Comunicacion) => {
    setEditing(item)
    setForm({ enlace: item.enlace, proveedor: item.proveedor, estado: item.estado, capacidad: item.capacidad, ip: item.ip, observacion: item.observacion })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!form.enlace || !form.proveedor) return
    if (editing) {
      setItems((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...form } : c))
    } else {
      setItems((prev) => [...prev, { id: String(Date.now()), sucursalId: id!, ...form }])
    }
    setDialogOpen(false)
  }

  const handleDelete = (itemId: string) => {
    setItems((prev) => prev.filter((c) => c.id !== itemId))
    setDeleteId(null)
  }

  const columns = [
    { key: 'enlace', label: 'Enlace', render: (row: Record<string, unknown>) => (
      <div className="flex items-center gap-2">
        <Wifi size={14} style={{ color: 'var(--accent-blue)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{String(row.enlace)}</span>
      </div>
    )},
    { key: 'proveedor', label: 'Proveedor', render: (row: Record<string, unknown>) => (
      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{String(row.proveedor)}</span>
    )},
    { key: 'estado', label: 'Estado', render: (row: Record<string, unknown>) => (
      <Badge variant={estadoBadge(String(row.estado))}>{estadoLabel[String(row.estado)] ?? String(row.estado)}</Badge>
    )},
    { key: 'capacidad', label: 'Capacidad', render: (row: Record<string, unknown>) => (
      <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>{String(row.capacidad)}</span>
    )},
    { key: 'ip', label: 'IP', render: (row: Record<string, unknown>) => (
      <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{String(row.ip)}</span>
    )},
    { key: 'observacion', label: 'Observación', render: (row: Record<string, unknown>) => (
      <span className="text-sm truncate max-w-32 block" style={{ color: 'var(--text-secondary)' }}>{String(row.observacion) || '—'}</span>
    )},
    { key: 'acciones', label: 'Acciones', render: (row: Record<string, unknown>) => {
      const item = row as unknown as Comunicacion
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
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Gestión de Comunicaciones</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{sucursal?.nombre ?? `Sucursal ${id}`}</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} />Nuevo Enlace</Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar enlace o proveedor..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border text-sm outline-none"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      <DataTable columns={columns} data={filtered as unknown as Record<string, unknown>[]} emptyMessage="No hay enlaces configurados" />

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editing ? 'Editar Enlace' : 'Nuevo Enlace'}
        footer={
          <>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.enlace || !form.proveedor}>Guardar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nombre del enlace *" value={form.enlace} onChange={(e) => setForm({ ...form, enlace: e.target.value })} placeholder="Ej: Enlace Principal MPLS" />
          <Input label="Proveedor *" value={form.proveedor} onChange={(e) => setForm({ ...form, proveedor: e.target.value })} placeholder="Ej: Claro" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Estado</label>
            <select
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
              className="h-10 px-3 rounded-lg border text-sm outline-none"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              <option value="activo">Activo</option>
              <option value="standby">Standby</option>
              <option value="falla">Falla</option>
            </select>
          </div>
          <Input label="Capacidad" value={form.capacidad} onChange={(e) => setForm({ ...form, capacidad: e.target.value })} placeholder="Ej: 100 Mbps" />
          <Input label="IP" value={form.ip} onChange={(e) => setForm({ ...form, ip: e.target.value })} placeholder="Ej: 192.168.1.1" />
          <Input label="Observación" value={form.observacion} onChange={(e) => setForm({ ...form, observacion: e.target.value })} placeholder="Opcional" />
        </div>
      </Dialog>
    </div>
  )
}
