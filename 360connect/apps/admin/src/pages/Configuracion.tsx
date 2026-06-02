import { useState } from 'react'
import { Save, Settings, Shield, Palette, Globe } from 'lucide-react'

const TABS = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'seguridad', label: 'Seguridad', icon: Shield },
]

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{description}</p>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full h-9 px-3 rounded-lg border text-sm outline-none focus:ring-1 ring-[var(--accent-blue)]"
const inputStyle = { backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }

function TabGeneral() {
  const [cfg, setCfg] = useState({ nombre: '360Connect Demo', timezone: 'America/Santiago', idioma: 'es', email: 'admin@360connect.cl' })
  const set = (k: string, v: string) => setCfg((c) => ({ ...c, [k]: v }))

  return (
    <div className="space-y-6">
      <SectionHeader title="Datos de la Instancia" description="Información básica de la plataforma" />
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Field label="Nombre de la instancia">
            <input value={cfg.nombre} onChange={(e) => set('nombre', e.target.value)} className={inputCls} style={inputStyle} />
          </Field>
        </div>
        <Field label="Email de contacto">
          <input type="email" value={cfg.email} onChange={(e) => set('email', e.target.value)} className={inputCls} style={inputStyle} />
        </Field>
        <Field label="Idioma">
          <select value={cfg.idioma} onChange={(e) => set('idioma', e.target.value)} className={inputCls} style={inputStyle}>
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </Field>
        <Field label="Zona horaria">
          <select value={cfg.timezone} onChange={(e) => set('timezone', e.target.value)} className={inputCls} style={inputStyle}>
            <option value="America/Santiago">America/Santiago (UTC-3/4)</option>
            <option value="America/Buenos_Aires">America/Buenos_Aires (UTC-3)</option>
            <option value="America/Bogota">America/Bogota (UTC-5)</option>
            <option value="America/Mexico_City">America/Mexico_City (UTC-6)</option>
          </select>
        </Field>
        <Field label="Logo URL">
          <input placeholder="https://..." className={inputCls} style={inputStyle} />
        </Field>
      </div>
    </div>
  )
}

const THEME_COLORS = ['#4f7cff', '#ff7c4f', '#4fff8b', '#c084fc', '#f59e0b', '#06b6d4']

function TabBranding() {
  const [theme, setTheme] = useState({ primary: '#4f7cff', secondary: '#ff7c4f', darkMode: true })

  return (
    <div className="space-y-6">
      <SectionHeader title="Apariencia" description="Personaliza los colores y tema de la plataforma" />
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Color primario</label>
          <div className="flex gap-2 flex-wrap">
            {THEME_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setTheme((t) => ({ ...t, primary: c }))}
                className="w-8 h-8 rounded-full transition-all"
                style={{ backgroundColor: c, outline: theme.primary === c ? `3px solid ${c}` : 'none', outlineOffset: '2px' }}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Color de acento</label>
          <div className="flex gap-2 flex-wrap">
            {THEME_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setTheme((t) => ({ ...t, secondary: c }))}
                className="w-8 h-8 rounded-full transition-all"
                style={{ backgroundColor: c, outline: theme.secondary === c ? `3px solid ${c}` : 'none', outlineOffset: '2px' }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Modo oscuro</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Recomendado para instalaciones en campo</p>
          </div>
          <button
            onClick={() => setTheme((t) => ({ ...t, darkMode: !t.darkMode }))}
            className="w-10 h-5 rounded-full transition-all relative"
            style={{ backgroundColor: theme.darkMode ? 'var(--accent-blue)' : 'var(--bg-hover)' }}
          >
            <span
              className="absolute w-4 h-4 rounded-full top-0.5 transition-all"
              style={{ backgroundColor: 'white', left: theme.darkMode ? '1.25rem' : '0.125rem' }}
            />
          </button>
        </div>

        {/* Preview */}
        <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Vista previa</p>
          <div className="rounded-lg p-3 flex items-center gap-3" style={{ backgroundColor: 'var(--bg-card)' }}>
            <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: theme.primary + '33' }}>
              <div className="w-full h-full rounded-lg" style={{ backgroundColor: theme.primary, opacity: 0.7 }} />
            </div>
            <div className="flex-1">
              <div className="h-2.5 rounded-full mb-1.5 w-24" style={{ backgroundColor: theme.primary + '44' }} />
              <div className="h-2 rounded-full w-36" style={{ backgroundColor: 'var(--text-secondary)', opacity: 0.3 }} />
            </div>
            <div className="h-6 w-16 rounded-lg" style={{ backgroundColor: theme.primary }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function TabSeguridad() {
  const [cfg, setCfg] = useState({ minPassword: 8, sessionTimeout: 60, mfa: false, maxIntentos: 5, lockoutMin: 15 })
  const set = (k: string, v: number | boolean) => setCfg((c) => ({ ...c, [k]: v }))

  return (
    <div className="space-y-6">
      <SectionHeader title="Política de contraseñas" description="Requisitos mínimos para contraseñas de usuarios" />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Longitud mínima">
          <input type="number" min={6} max={32} value={cfg.minPassword}
            onChange={(e) => set('minPassword', +e.target.value)}
            className={inputCls} style={inputStyle} />
        </Field>
        <Field label="Intentos antes de bloqueo">
          <input type="number" min={3} max={10} value={cfg.maxIntentos}
            onChange={(e) => set('maxIntentos', +e.target.value)}
            className={inputCls} style={inputStyle} />
        </Field>
        <Field label="Bloqueo (minutos)">
          <input type="number" min={5} max={120} value={cfg.lockoutMin}
            onChange={(e) => set('lockoutMin', +e.target.value)}
            className={inputCls} style={inputStyle} />
        </Field>
        <Field label="Timeout de sesión (min)">
          <input type="number" min={15} max={480} value={cfg.sessionTimeout}
            onChange={(e) => set('sessionTimeout', +e.target.value)}
            className={inputCls} style={inputStyle} />
        </Field>
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Autenticación en dos pasos (MFA)</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Requiere código TOTP en cada inicio de sesión</p>
        </div>
        <button
          onClick={() => set('mfa', !cfg.mfa)}
          className="w-10 h-5 rounded-full transition-all relative"
          style={{ backgroundColor: cfg.mfa ? 'var(--accent-green)' : 'var(--bg-hover)' }}
        >
          <span
            className="absolute w-4 h-4 rounded-full top-0.5 transition-all"
            style={{ backgroundColor: 'white', left: cfg.mfa ? '1.25rem' : '0.125rem' }}
          />
        </button>
      </div>
    </div>
  )
}

export default function Configuracion() {
  const [tab, setTab] = useState('general')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Configuración</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Administra los parámetros de la instancia</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium transition-all"
          style={{ backgroundColor: saved ? 'var(--accent-green)' : 'var(--accent-blue)', color: 'white' }}
        >
          {saved ? <><Settings size={15} />¡Guardado!</> : <><Save size={15} />Guardar cambios</>}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex items-center gap-2 flex-1 h-8 px-3 rounded-lg text-sm transition-all"
            style={{
              backgroundColor: tab === id ? 'var(--bg-hover)' : 'transparent',
              color: tab === id ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}
          >
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        {tab === 'general' && <TabGeneral />}
        {tab === 'branding' && <TabBranding />}
        {tab === 'seguridad' && <TabSeguridad />}
      </div>
    </div>
  )
}
