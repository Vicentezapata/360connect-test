import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  LayoutDashboard, Building2, FileText, Users, ScrollText,
  Settings, ChevronLeft, ChevronRight, Bell, LogOut, Camera,
  Map, Wifi, Battery, Radio, ClipboardList
} from 'lucide-react'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/mapa', icon: Map, label: 'Mapa General' },
  { path: '/sucursales', icon: Building2, label: 'Sucursales' },
  { path: '/documentos', icon: FileText, label: 'Documentos' },
  { path: '/usuarios', icon: Users, label: 'Usuarios' },
  { path: '/audit', icon: ScrollText, label: 'Audit Log' },
  { path: '/configuracion', icon: Settings, label: 'Configuración' },
  { path: '/admin/notificaciones', icon: Bell, label: 'Notificaciones', badge: 2 },
]

const sucursalSubNav = [
  { segment: 'espacios', label: 'Espacios 360°', icon: Camera },
  { segment: 'planimetria', label: 'Planimetría', icon: Map },
  { segment: 'comunicaciones', label: 'Comunicaciones', icon: Wifi },
  { segment: 'baterias', label: 'Baterías', icon: Battery },
  { segment: 'torres', label: 'Torres', icon: Radio },
  { segment: 'informes', label: 'Informes', icon: ClipboardList },
]

function SucursalSubNav({ sucursalId, currentPath }: { sucursalId: string; currentPath: string }) {
  return (
    <div
      className="flex items-center gap-1 px-4 overflow-x-auto border-b flex-shrink-0"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
    >
      {sucursalSubNav.map(({ segment, label, icon: Icon }) => {
        const href = `/sucursales/${sucursalId}/${segment}`
        const active = currentPath.startsWith(href)
        return (
          <Link
            key={segment}
            to={href}
            className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all"
            style={{
              borderBottomColor: active ? 'var(--accent-blue)' : 'transparent',
              color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}
          >
            <Icon size={14} />
            {label}
          </Link>
        )
      })}
    </div>
  )
}

function LayoutInner({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams<{ id?: string }>()

  const sucursalId = (() => {
    const match = location.pathname.match(/^\/sucursales\/([^/]+)\//)
    return match ? match[1] : null
  })()

  const getBreadcrumb = () => {
    const path = location.pathname
    if (path === '/dashboard') return ['Dashboard']
    if (path.startsWith('/sucursales/') && path.endsWith('/espacios')) return ['Sucursales', 'Espacios 360°']
    if (path.startsWith('/sucursales/') && path.endsWith('/planimetria/historial')) return ['Sucursales', 'Planimetría', 'Historial']
    if (path.startsWith('/sucursales/') && path.endsWith('/planimetria')) return ['Sucursales', 'Planimetría']
    if (path.startsWith('/sucursales/') && path.endsWith('/editar')) return ['Sucursales', 'Editar']
    if (path.startsWith('/sucursales/') && path.endsWith('/comunicaciones')) return ['Sucursales', 'Comunicaciones']
    if (path.startsWith('/sucursales/') && path.endsWith('/baterias')) return ['Sucursales', 'Baterías']
    if (path.startsWith('/sucursales/') && path.endsWith('/torres')) return ['Sucursales', 'Torres']
    if (path.startsWith('/sucursales/') && path.endsWith('/informes')) return ['Sucursales', 'Informes']
    if (path === '/sucursales/nueva') return ['Sucursales', 'Nueva']
    if (path.startsWith('/sucursales')) return ['Sucursales']
    if (path.startsWith('/documentos')) return ['Documentos']
    if (path.startsWith('/usuarios')) return ['Usuarios']
    if (path.startsWith('/audit')) return ['Audit Log']
    if (path.startsWith('/configuracion')) return ['Configuración']
    if (path === '/admin/notificaciones') return ['Notificaciones']
    if (path === '/admin/perfil') return ['Perfil']
    return []
  }

  const breadcrumbs = getBreadcrumb()

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col flex-shrink-0 transition-all duration-300 border-r"
        style={{
          width: collapsed ? '64px' : '240px',
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center h-16 px-4 border-b flex-shrink-0"
          style={{ borderColor: 'var(--border)' }}
        >
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
          >
            360
          </div>
          {!collapsed && (
            <span className="ml-3 font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              360Connect
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center h-10 mx-2 mb-1 rounded-lg px-3 transition-all duration-150"
                style={{
                  backgroundColor: active ? 'var(--bg-hover)' : 'transparent',
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
                title={collapsed ? item.label : undefined}
              >
                <div className="relative flex-shrink-0">
                  <Icon size={18} style={{ color: active ? 'var(--accent-blue)' : undefined }} />
                  {item.badge && item.badge > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center"
                      style={{ backgroundColor: 'var(--accent-red)', color: 'white', fontSize: '10px' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                {!collapsed && (
                  <span className="ml-3 text-sm font-medium truncate">{item.label}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-3 border-t flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full h-9 rounded-lg transition-all"
            style={{ color: 'var(--text-secondary)' }}
          >
            {collapsed ? <ChevronRight size={18} /> : (
              <div className="flex items-center gap-2 text-sm">
                <ChevronLeft size={18} />
                <span>Colapsar</span>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <header
          className="flex items-center justify-between h-16 px-6 border-b flex-shrink-0"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
        >
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span style={{ color: 'var(--border)' }}>/</span>}
                <span style={{ color: i === breadcrumbs.length - 1 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {crumb}
                </span>
              </span>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/notificaciones')}
              className="relative p-2 rounded-lg transition-all hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Bell size={18} />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ backgroundColor: 'var(--accent-red)' }}
              />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => navigate('/admin/perfil')}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all hover:opacity-80"
                style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}
              >
                MG
              </button>
              <button
                onClick={() => navigate('/admin/perfil')}
                className="text-sm font-medium hover:opacity-80 transition-all"
                style={{ color: 'var(--text-primary)' }}
              >
                María G.
              </button>
              <button
                onClick={() => navigate('/login')}
                className="p-1 rounded transition-all ml-1 hover:opacity-80"
                style={{ color: 'var(--text-secondary)' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Per-sucursal sub-nav */}
        {sucursalId && <SucursalSubNav sucursalId={sucursalId} currentPath={location.pathname} />}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  return <LayoutInner collapsed={collapsed} setCollapsed={setCollapsed} />
}
