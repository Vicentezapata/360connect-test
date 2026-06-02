import { useState } from 'react'
import { Plus, Search, Users, Mail, Shield, X, Save, Eye, EyeOff } from 'lucide-react'
import { mockUsuarios } from '../data/mock'

const ROLES = ['Super Admin', 'Admin', 'Técnico', 'Visualizador']
const rolColor: Record<string, string> = {
  'Super Admin': '#c084fc',
  'Admin': 'var(--accent-blue)',
  'Técnico': 'var(--accent-orange)',
  'Visualizador': 'var(--accent-green)',
}

interface Usuario {
  id: string
  nombre: string
  email: string
  rolId: string
  rolNombre: string
  sucursalesIds?: string[]
  sucursalesNombres: string
  estado: string
}

function UserModal({ user, onClose, onSave }: { user: Partial<Usuario> | null; onClose: () => void; onSave: (u: Partial<Usuario>) => void }) {
  const [form, setForm] = useState<Partial<Usuario>>({
    nombre: user?.nombre ?? '',
    email: user?.email ?? '',
    rolNombre: user?.rolNombre ?? 'Técnico',
    sucursalesNombres: user?.sucursalesNombres ?? '',
    estado: user?.estado ?? 'activo',
  })
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const isNew = !user?.id

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-md rounded-2xl border p-6 space-y-5" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            {isNew ? 'Nuevo Usuario' : 'Editar Usuario'}
          </h3>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}><X size={18} /></button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Nombre completo *</label>
            <input value={form.nombre} onChange={(e) => set('nombre', e.target.value)} placeholder="María González"
              className="w-full h-9 px-3 rounded-lg border text-sm outline-none"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Email *</label>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="usuario@360connect.cl"
              className="w-full h-9 px-3 rounded-lg border text-sm outline-none"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          </div>
          {isNew && (
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Contraseña inicial *</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full h-9 px-3 pr-9 rounded-lg border text-sm outline-none"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          )}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Rol *</label>
            <select value={form.rolNombre} onChange={(e) => set('rolNombre', e.target.value)}
              className="w-full h-9 px-3 rounded-lg border text-sm outline-none"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Estado</label>
            <select value={form.estado} onChange={(e) => set('estado', e.target.value)}
              className="w-full h-9 px-3 rounded-lg border text-sm outline-none"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Sucursales asignadas</label>
            <input value={form.sucursalesNombres} onChange={(e) => set('sucursalesNombres', e.target.value)} placeholder="Ej: Centro Santiago, Providencia"
              className="w-full h-9 px-3 rounded-lg border text-sm outline-none"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-9 rounded-lg text-sm border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Cancelar</button>
          <button onClick={() => onSave(form)} className="flex-1 h-9 rounded-lg text-sm font-medium flex items-center justify-center gap-2" style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}>
            <Save size={15} />
            {isNew ? 'Crear Usuario' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Usuarios() {
  const [search, setSearch] = useState('')
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios)
  const [editUser, setEditUser] = useState<Partial<Usuario> | null | undefined>(undefined)
  const [rolFilter, setRolFilter] = useState('Todos')

  const filtered = usuarios.filter((u) => {
    const matchSearch = u.nombre.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRol = rolFilter === 'Todos' || u.rolNombre === rolFilter
    return matchSearch && matchRol
  })

  const handleSave = (data: Partial<Usuario>) => {
    if (editUser?.id) {
      setUsuarios((prev) => prev.map((u) => u.id === editUser.id ? { ...u, ...data } : u))
    } else {
      setUsuarios((prev) => [...prev, { id: String(Date.now()), nombre: data.nombre!, email: data.email!, rolId: 'rol-3', rolNombre: data.rolNombre!, sucursalesNombres: data.sucursalesNombres!, estado: data.estado! }])
    }
    setEditUser(undefined)
  }

  return (
    <div className="space-y-6">
      {editUser !== undefined && <UserModal user={editUser} onClose={() => setEditUser(undefined)} onSave={handleSave} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Usuarios</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{filtered.length} usuarios</p>
        </div>
        <button
          onClick={() => setEditUser({})}
          className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium hover:opacity-90"
          style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
        >
          <Plus size={15} />
          Nuevo Usuario
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border text-sm outline-none"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
        <div className="flex gap-2">
          {['Todos', ...ROLES].map((r) => (
            <button
              key={r}
              onClick={() => setRolFilter(r)}
              className="h-9 px-3 rounded-lg text-sm transition-all"
              style={{
                backgroundColor: rolFilter === r ? 'var(--accent-blue)22' : 'var(--bg-card)',
                color: rolFilter === r ? 'var(--accent-blue)' : 'var(--text-secondary)',
                border: `1px solid ${rolFilter === r ? 'var(--accent-blue)44' : 'var(--border)'}`,
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Usuario', 'Rol', 'Sucursales', 'Estado', 'Acciones'].map((h) => (
                <th key={h} className="text-left text-xs font-medium px-5 py-3" style={{ color: 'var(--text-secondary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border)' }} className="hover:bg-[var(--bg-hover)] transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: (rolColor[u.rolNombre] ?? 'var(--accent-blue)') + '22', color: rolColor[u.rolNombre] ?? 'var(--accent-blue)' }}
                    >
                      {u.nombre.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{u.nombre}</p>
                      <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                        <Mail size={11} />{u.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: (rolColor[u.rolNombre] ?? 'var(--accent-blue)') + '22', color: rolColor[u.rolNombre] ?? 'var(--accent-blue)' }}
                  >
                    <Shield size={11} />{u.rolNombre}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm" style={{ color: 'var(--text-secondary)', maxWidth: '200px' }}>
                  <span className="truncate block">{u.sucursalesNombres}</span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className="inline-flex h-6 px-2.5 rounded-full text-xs font-medium items-center"
                    style={{
                      backgroundColor: u.estado === 'activo' ? 'var(--accent-green)22' : 'var(--accent-red)22',
                      color: u.estado === 'activo' ? 'var(--accent-green)' : 'var(--accent-red)',
                    }}
                  >
                    {u.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => setEditUser(u)}
                    className="h-7 px-3 rounded-lg text-xs"
                    style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Users size={40} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-secondary)' }} />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No se encontraron usuarios</p>
          </div>
        )}
      </div>
    </div>
  )
}
