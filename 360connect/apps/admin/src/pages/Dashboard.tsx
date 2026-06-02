import { Building2, Camera, FileText, TrendingUp, ArrowUpRight } from 'lucide-react'
import { mockActividad } from '../data/mock'

const kpis = [
  { icon: Building2, label: 'Sucursales Activas', value: '12', trend: '+2', color: 'var(--accent-blue)' },
  { icon: Camera, label: 'Espacios 360°', value: '48', trend: '+6', color: 'var(--accent-orange)' },
  { icon: FileText, label: 'Documentos', value: '127', trend: '+12', color: 'var(--accent-green)' },
  { icon: TrendingUp, label: 'Visitas Este Mes', value: '34', trend: '+8', color: '#c084fc' },
]

const estadoData = [
  { label: 'Activas', value: 9, max: 12, color: 'var(--accent-green)' },
  { label: 'Inactivas', value: 3, max: 12, color: 'var(--accent-red)' },
  { label: 'Pendientes', value: 2, max: 12, color: 'var(--accent-orange)' },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Bienvenido, María. Aquí está el resumen del sistema.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div
              key={kpi.label}
              className="rounded-xl border p-5 flex items-start justify-between"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div>
                <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{kpi.label}</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{kpi.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight size={14} style={{ color: 'var(--accent-green)' }} />
                  <span className="text-xs" style={{ color: 'var(--accent-green)' }}>{kpi.trend} este mes</span>
                </div>
              </div>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center opacity-90"
                style={{ backgroundColor: kpi.color + '22', color: kpi.color }}
              >
                <Icon size={20} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad Reciente */}
        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Actividad Reciente</h2>
          <div className="space-y-3">
            {mockActividad.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <span className="text-lg leading-none mt-0.5">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{item.texto}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{item.tiempo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sucursales por Estado */}
        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Sucursales por Estado</h2>
          <div className="space-y-5">
            {estadoData.map((d) => (
              <div key={d.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: 'var(--text-secondary)' }}>{d.label}</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{d.value}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-hover)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(d.value / d.max) * 100}%`, backgroundColor: d.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs mt-4" style={{ color: 'var(--text-secondary)' }}>Total: 14 sucursales en el sistema</p>
        </div>
      </div>
    </div>
  )
}
