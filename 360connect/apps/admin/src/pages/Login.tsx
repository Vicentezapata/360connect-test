import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Lock, Mail, Eye, EyeOff, Monitor, Smartphone } from 'lucide-react'

type Modo = 'admin' | 'campo'

export default function Login() {
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [modo, setModo] = useState<Modo>('admin')

  const handleLogin = () => {
    if (modo === 'admin') navigate('/dashboard')
    else navigate('/viewer')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(79,124,255,0.08) 0%, transparent 60%)' }} />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-sm rounded-2xl border p-8 shadow-2xl"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold mb-4" style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}>
            360
          </div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>360Connect</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Motorola Solutions</p>
        </div>

        {/* Mode selector */}
        <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          {([['admin', Monitor, 'Administración'], ['campo', Smartphone, 'App de Campo']] as const).map(([m, Icon, label]) => (
            <button
              key={m}
              onClick={() => setModo(m as Modo)}
              className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs transition-all"
              style={{
                backgroundColor: modo === m ? 'var(--bg-hover)' : 'transparent',
                color: modo === m ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              <Icon size={13} />{label}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
              <input type="email" defaultValue={modo === 'admin' ? 'admin@360connect.cl' : 'tecnico@360connect.cl'}
                className="w-full h-10 pl-9 pr-3 rounded-lg border text-sm outline-none"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Contraseña</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
              <input type={showPass ? 'text' : 'password'} defaultValue="••••••••"
                className="w-full h-10 pl-9 pr-10 rounded-lg border text-sm outline-none"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button onClick={handleLogin}
            className="w-full h-10 rounded-lg font-medium text-sm mt-2 transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}>
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}
