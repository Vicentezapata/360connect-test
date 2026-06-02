import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Eye, Clock, User } from 'lucide-react'
import { mockSucursales, mockPlanimetriaVersiones } from '../data/mock'

export default function HistorialPlanimetria() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const sucursal = mockSucursales.find((s) => s.id === id)
  const [rollbackTarget, setRollbackTarget] = useState<string | null>(null)
  const [rolledBack, setRolledBack] = useState<string | null>(null)

  const handleRollback = (versionId: string) => {
    setRolledBack(versionId)
    setRollbackTarget(null)
  }

  return (
    <div className="space-y-6">
      {/* Confirm modal */}
      {rollbackTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-sm rounded-2xl border p-6 space-y-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent-orange)22', color: 'var(--accent-orange)' }}>
                <RotateCcw size={20} />
              </div>
              <div>
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Confirmar Rollback</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Esta acción creará una nueva versión</p>
              </div>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              ¿Querés restaurar la versión <strong style={{ color: 'var(--text-primary)' }}>
                {mockPlanimetriaVersiones.find((v) => v.id === rollbackTarget)?.version}
              </strong>? Se creará una nueva versión basada en ese estado.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setRollbackTarget(null)}
                className="flex-1 h-9 rounded-lg text-sm border"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleRollback(rollbackTarget)}
                className="flex-1 h-9 rounded-lg text-sm font-medium"
                style={{ backgroundColor: 'var(--accent-orange)', color: 'white' }}
              >
                Restaurar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/sucursales/${id}/planimetria`)}
          className="p-2 rounded-lg hover:opacity-80"
          style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-card)' }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Historial de Planimetrías
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {sucursal?.nombre} · {mockPlanimetriaVersiones.length} versiones
          </p>
        </div>
      </div>

      {/* Versions list */}
      <div className="space-y-3">
        {mockPlanimetriaVersiones.map((version, i) => (
          <div
            key={version.id}
            className="rounded-xl border p-5 flex items-start justify-between gap-4 transition-all"
            style={{
              backgroundColor: rolledBack === version.id ? 'var(--accent-green)11' : 'var(--bg-card)',
              borderColor: rolledBack === version.id ? 'var(--accent-green)44' : i === 0 ? 'var(--accent-blue)44' : 'var(--border)',
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{
                  backgroundColor: i === 0 ? 'var(--accent-blue)22' : 'var(--bg-hover)',
                  color: i === 0 ? 'var(--accent-blue)' : 'var(--text-secondary)',
                }}
              >
                {version.version}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{version.version}</span>
                  {i === 0 && (
                    <span
                      className="h-5 px-2 rounded-full text-xs font-medium"
                      style={{ backgroundColor: 'var(--accent-blue)22', color: 'var(--accent-blue)' }}
                    >
                      Actual
                    </span>
                  )}
                  {rolledBack === version.id && (
                    <span
                      className="h-5 px-2 rounded-full text-xs font-medium"
                      style={{ backgroundColor: 'var(--accent-green)22', color: 'var(--accent-green)' }}
                    >
                      ✓ Restaurada
                    </span>
                  )}
                </div>
                <p className="text-sm mt-1" style={{ color: 'var(--text-primary)' }}>{version.comentario}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} style={{ color: 'var(--text-secondary)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{version.fecha}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={12} style={{ color: 'var(--text-secondary)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{version.subidoPor}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs"
                style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
              >
                <Eye size={13} />
                Ver
              </button>
              {i > 0 && (
                <button
                  onClick={() => setRollbackTarget(version.id)}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs"
                  style={{ backgroundColor: 'var(--accent-orange)22', color: 'var(--accent-orange)' }}
                >
                  <RotateCcw size={13} />
                  Restaurar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Link
          to={`/sucursales/${id}/planimetria`}
          className="flex items-center gap-2 h-9 px-5 rounded-lg text-sm font-medium border"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={15} />
          Volver al Editor
        </Link>
      </div>
    </div>
  )
}
