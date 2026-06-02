import { useState } from 'react'
import { Search, Filter, AlertCircle, CheckCircle, Info, Zap } from 'lucide-react'
import { mockAuditLog } from '../data/mock'

const ACCIONES = ['Todas', 'LOGIN', 'CREATE', 'UPDATE', 'DELETE']
const RECURSOS = ['Todos', 'Sistema', 'Sucursal', 'Espacio', 'Usuario', 'Documento', 'Planimetría']

const accionConfig: Record<string, { color: string; icon: React.FC<{ size: number }> }> = {
  LOGIN: { color: 'var(--accent-blue)', icon: ({ size }) => <Zap size={size} /> },
  CREATE: { color: 'var(--accent-green)', icon: ({ size }) => <CheckCircle size={size} /> },
  UPDATE: { color: 'var(--accent-orange)', icon: ({ size }) => <Info size={size} /> },
  DELETE: { color: 'var(--accent-red)', icon: ({ size }) => <AlertCircle size={size} /> },
}

export default function AuditLog() {
  const [search, setSearch] = useState('')
  const [accion, setAccion] = useState('Todas')
  const [recurso, setRecurso] = useState('Todos')
  const [page, setPage] = useState(1)
  const PER_PAGE = 6

  const filtered = mockAuditLog.filter((log) => {
    const matchSearch = log.usuarioNombre.toLowerCase().includes(search.toLowerCase()) || log.recursoId.toLowerCase().includes(search.toLowerCase())
    const matchAccion = accion === 'Todas' || log.accion === accion
    const matchRecurso = recurso === 'Todos' || log.recurso === recurso
    return matchSearch && matchAccion && matchRecurso
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Audit Log</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          {filtered.length} eventos registrados
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Buscar por usuario o ID..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border text-sm outline-none"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} style={{ color: 'var(--text-secondary)' }} />
          <select value={accion} onChange={(e) => { setAccion(e.target.value); setPage(1) }}
            className="h-9 px-3 rounded-lg border text-sm outline-none"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
            {ACCIONES.map((a) => <option key={a} value={a}>{a === 'Todas' ? 'Todas las acciones' : a}</option>)}
          </select>
          <select value={recurso} onChange={(e) => { setRecurso(e.target.value); setPage(1) }}
            className="h-9 px-3 rounded-lg border text-sm outline-none"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
            {RECURSOS.map((r) => <option key={r} value={r}>{r === 'Todos' ? 'Todos los recursos' : r}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Fecha / Hora', 'Usuario', 'Acción', 'Recurso', 'ID', 'IP'].map((h) => (
                <th key={h} className="text-left text-xs font-medium px-5 py-3" style={{ color: 'var(--text-secondary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((log, i) => {
              const cfg = accionConfig[log.accion] ?? accionConfig['LOGIN']
              const Icon = cfg.icon
              return (
                <>
                  <tr key={log.id} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border)' }} className="hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="px-5 py-3">
                      <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{log.fecha}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{log.usuarioNombre}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: cfg.color + '22', color: cfg.color }}
                      >
                        <Icon size={11} />
                        {log.accion}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{log.recurso}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{log.recursoId}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{log.ip}</span>
                    </td>
                  </tr>
                  {(log.valorAnterior || log.valorNuevo) && (
                    <tr key={`${log.id}-diff`} style={{ borderTop: '1px dashed var(--border)' }}>
                      <td colSpan={6} className="px-5 py-3" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <div className="flex gap-6 text-xs font-mono">
                          {log.valorAnterior && (
                            <div>
                              <span className="block mb-1 font-sans font-medium" style={{ color: 'var(--accent-red)' }}>− Anterior</span>
                              <pre className="whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{JSON.stringify(log.valorAnterior, null, 2)}</pre>
                            </div>
                          )}
                          {log.valorNuevo && (
                            <div>
                              <span className="block mb-1 font-sans font-medium" style={{ color: 'var(--accent-green)' }}>+ Nuevo</span>
                              <pre className="whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{JSON.stringify(log.valorNuevo, null, 2)}</pre>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <AlertCircle size={40} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-secondary)' }} />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No se encontraron eventos</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Página {page} de {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-7 px-3 rounded-lg text-xs disabled:opacity-40"
                style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-7 px-3 rounded-lg text-xs disabled:opacity-40"
                style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
