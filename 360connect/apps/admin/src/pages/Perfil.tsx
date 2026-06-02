import { useState } from 'react'
import { User, Shield, Eye, EyeOff, Edit3, Save } from 'lucide-react'
import { Button, Card, Dialog, Input } from '../components/ui'

interface UserInfo {
  nombre: string
  email: string
  rol: string
  fechaCreacion: string
}

const currentUser: UserInfo = {
  nombre: 'María González',
  email: 'maria@360connect.cl',
  rol: 'Super Admin',
  fechaCreacion: '2023-01-15',
}

function getInitials(nombre: string) {
  return nombre
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function Perfil() {
  const [user, setUser] = useState<UserInfo>(currentUser)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({ nombre: user.nombre, email: user.email })

  const [pwForm, setPwForm] = useState({ actual: '', nueva: '', confirmar: '' })
  const [showPw, setShowPw] = useState({ actual: false, nueva: false, confirmar: false })
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)

  const handleSaveInfo = () => {
    setUser({ ...user, nombre: editForm.nombre, email: editForm.email })
    setEditDialogOpen(false)
  }

  const handleSavePw = () => {
    setPwError('')
    setPwSuccess(false)
    if (!pwForm.actual) { setPwError('Ingresa tu contraseña actual'); return }
    if (pwForm.nueva.length < 8) { setPwError('La nueva contraseña debe tener al menos 8 caracteres'); return }
    if (pwForm.nueva !== pwForm.confirmar) { setPwError('Las contraseñas no coinciden'); return }
    setPwSuccess(true)
    setPwForm({ actual: '', nueva: '', confirmar: '' })
  }

  const toggle = (field: 'actual' | 'nueva' | 'confirmar') => {
    setShowPw((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Perfil de Usuario</h1>

      {/* Personal Info */}
      <Card>
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-2">
            <User size={16} style={{ color: 'var(--accent-blue)' }} />
            <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Información Personal</h2>
          </div>
          <Button size="sm" variant="outline" onClick={() => { setEditForm({ nombre: user.nombre, email: user.email }); setEditDialogOpen(true) }}>
            <Edit3 size={13} /> Editar
          </Button>
        </div>

        <div className="flex items-center gap-5 mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
            style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
          >
            {getInitials(user.nombre)}
          </div>
          <div>
            <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{user.nombre}</p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Rol', value: user.rol },
            { label: 'Miembro desde', value: user.fechaCreacion },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <Shield size={16} style={{ color: 'var(--accent-orange)' }} />
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Seguridad</h2>
        </div>

        <div className="space-y-4">
          {(['actual', 'nueva', 'confirmar'] as const).map((field) => {
            const labels: Record<string, string> = { actual: 'Contraseña actual', nueva: 'Nueva contraseña', confirmar: 'Confirmar nueva contraseña' }
            return (
              <div key={field} className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{labels[field]}</label>
                <div className="relative">
                  <input
                    type={showPw[field] ? 'text' : 'password'}
                    value={pwForm[field]}
                    onChange={(e) => { setPwForm((p) => ({ ...p, [field]: e.target.value })); setPwError(''); setPwSuccess(false) }}
                    placeholder="••••••••"
                    className="w-full h-10 px-3 pr-10 rounded-lg border text-sm outline-none"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: pwError && field !== 'actual' ? 'var(--accent-red)' : 'var(--border)', color: 'var(--text-primary)' }}
                  />
                  <button
                    type="button"
                    onClick={() => toggle(field)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {showPw[field] ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )
          })}

          {pwError && <p className="text-sm" style={{ color: 'var(--accent-red)' }}>{pwError}</p>}
          {pwSuccess && <p className="text-sm" style={{ color: 'var(--accent-green)' }}>Contraseña actualizada correctamente</p>}

          <Button onClick={handleSavePw} className="w-full" style={{ width: '100%' }}>
            <Save size={14} /> Actualizar Contraseña
          </Button>
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        title="Editar Información Personal"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveInfo} disabled={!editForm.nombre || !editForm.email}>Guardar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nombre completo"
            value={editForm.nombre}
            onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
          />
        </div>
      </Dialog>
    </div>
  )
}
