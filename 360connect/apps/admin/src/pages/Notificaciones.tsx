import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Clipboard, FileText, Settings, CheckCheck, ExternalLink } from 'lucide-react'
import { mockNotificaciones } from '../data/mock'
import { Button } from '../components/ui'

interface Notificacion {
  id: string
  tipo: string
  titulo: string
  mensaje: string
  fecha: string
  leida: boolean
  link: string
}

const tipoIcon = (tipo: string) => {
  const iconProps = { size: 16 }
  switch (tipo) {
    case 'alerta': return <Bell {...iconProps} style={{ color: 'var(--accent-red)' }} />
    case 'informe': return <Clipboard {...iconProps} style={{ color: 'var(--accent-blue)' }} />
    case 'documento': return <FileText {...iconProps} style={{ color: 'var(--accent-orange)' }} />
    case 'sistema': return <Settings {...iconProps} style={{ color: 'var(--text-secondary)' }} />
    default: return <Bell {...iconProps} style={{ color: 'var(--text-secondary)' }} />
  }
}

const tipoColor: Record<string, string> = {
  alerta: 'var(--accent-red)',
  informe: 'var(--accent-blue)',
  documento: 'var(--accent-orange)',
  sistema: 'var(--text-secondary)',
}

export default function Notificaciones() {
  const navigate = useNavigate()
  const [items, setItems] = useState<Notificacion[]>(mockNotificaciones)

  const unreadCount = items.filter((n) => !n.leida).length

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, leida: true })))
  }

  const markRead = (id: string) => {
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, leida: true } : n))
  }

  const handleClick = (item: Notificacion) => {
    markRead(item.id)
    navigate(item.link)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Centro de Notificaciones</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck size={14} />
            Marcar todo como leído
          </Button>
        )}
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        {items.map((item, i) => (
          <div
            key={item.id}
            className="relative flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
            style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}
            onClick={() => handleClick(item)}
          >
            {/* Unread indicator */}
            {!item.leida && (
              <div
                className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r"
                style={{ backgroundColor: tipoColor[item.tipo] ?? 'var(--accent-blue)' }}
              />
            )}

            {/* Icon */}
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                backgroundColor: (tipoColor[item.tipo] ?? 'var(--accent-blue)') + '22',
              }}
            >
              {tipoIcon(item.tipo)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p
                  className="text-sm font-medium"
                  style={{ color: item.leida ? 'var(--text-secondary)' : 'var(--text-primary)' }}
                >
                  {item.titulo}
                </p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.fecha}</span>
                  {!item.leida && (
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: tipoColor[item.tipo] ?? 'var(--accent-blue)' }}
                    />
                  )}
                </div>
              </div>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{item.mensaje}</p>
              <div className="flex items-center gap-1 mt-1">
                <ExternalLink size={11} style={{ color: 'var(--accent-blue)' }} />
                <span className="text-xs" style={{ color: 'var(--accent-blue)' }}>Ver detalle</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
