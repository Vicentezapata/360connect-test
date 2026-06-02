import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Building2, Eye, Filter, ZoomIn, ZoomOut, Locate, Layers, Tag } from 'lucide-react'
import { mockSucursales } from '../data/mock'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons broken by Vite bundling
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const estadoColor: Record<string, string> = {
  activo: '#4fff8b',
  inactivo: '#ff4f6b',
  pendiente: '#ff7c4f',
}

const TILE_LAYERS = {
  dark: {
    label: 'Oscuro',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© CARTO',
  },
  satellite: {
    label: 'Satélite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri',
  },
  street: {
    label: 'Calles',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap',
  },
} as const

type TileKey = keyof typeof TILE_LAYERS

/** Creates a pin icon with a floating label, like Motorola platform style */
function createLabeledIcon(color: string, nombre: string, showLabel: boolean, isSelected: boolean) {
  const scale = isSelected ? 1.25 : 1
  const pinW = Math.round(28 * scale)
  const pinH = Math.round(38 * scale)

  if (!showLabel) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 38" width="${pinW}" height="${pinH}">
        <filter id="s${color.replace('#','')}">
          <feDropShadow dx="0" dy="2" stdDeviation="${isSelected ? 3 : 2}" flood-color="#00000088"/>
        </filter>
        <path fill="${color}" filter="url(#s${color.replace('#','')})"
          d="M14 0C6.268 0 0 6.268 0 14c0 9 14 24 14 24S28 23 28 14C28 6.268 21.732 0 14 0z"/>
        <circle fill="white" cx="14" cy="14" r="${isSelected ? 6 : 5}"/>
        ${isSelected ? `<circle fill="${color}" cx="14" cy="14" r="2.5"/>` : ''}
      </svg>`
    return L.divIcon({
      html: svg,
      className: '',
      iconSize: [pinW, pinH],
      iconAnchor: [pinW / 2, pinH],
      popupAnchor: [0, -(pinH + 4)],
    })
  }

  // Label above with dashed line connector — Motorola style
  const labelPad = 8
  const fontSize = 12
  const charW = 7.2
  const labelW = Math.max(60, Math.round(nombre.length * charW) + labelPad * 2)
  const labelH = 26
  const dashedLineH = 16
  const totalH = labelH + dashedLineH + pinH
  const totalW = Math.max(pinW + 8, labelW + 8)
  const cx = totalW / 2

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" style="overflow:visible">
      <!-- Label box -->
      <rect x="${cx - labelW / 2}" y="0" width="${labelW}" height="${labelH}"
        rx="5" fill="${isSelected ? '#1a2a4a' : '#1e2130ee'}"
        stroke="${isSelected ? color : '#3a3f60'}" stroke-width="${isSelected ? 1.5 : 1}"/>
      <text x="${cx}" y="${labelH / 2 + 1}" text-anchor="middle" dominant-baseline="middle"
        font-family="Inter,system-ui,sans-serif" font-size="${fontSize}"
        font-weight="${isSelected ? '700' : '500'}" fill="${isSelected ? color : '#f0f2ff'}"
        letter-spacing="0.3">${nombre}</text>

      <!-- Dashed connector line -->
      <line x1="${cx}" y1="${labelH}" x2="${cx}" y2="${labelH + dashedLineH}"
        stroke="${color}" stroke-width="1.5" stroke-dasharray="3,2.5" opacity="0.8"/>

      <!-- Pin -->
      <g transform="translate(${cx - pinW / 2}, ${labelH + dashedLineH})">
        <filter id="ps${color.replace('#','')}${isSelected ? 's' : ''}">
          <feDropShadow dx="0" dy="2" stdDeviation="${isSelected ? 4 : 2}" flood-color="#00000099"/>
        </filter>
        <path fill="${color}" filter="url(#ps${color.replace('#','')}${isSelected ? 's' : ''})"
          d="M${pinW / 2} 0C${pinW * 0.226} 0 0 ${pinH * 0.168} 0 ${pinH * 0.368}c0 ${pinH * 0.237} ${pinW / 2} ${pinH * 0.632} ${pinW / 2} ${pinH * 0.632}S${pinW} ${pinH * 0.605} ${pinW} ${pinH * 0.368}C${pinW} ${pinH * 0.168} ${pinW * 0.774} 0 ${pinW / 2} 0z"/>
        <circle fill="white" cx="${pinW / 2}" cy="${pinH * 0.368}" r="${isSelected ? 5.5 : 4.5}"/>
        ${isSelected ? `<circle fill="${color}" cx="${pinW / 2}" cy="${pinH * 0.368}" r="2"/>` : ''}
      </g>
    </svg>`

  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [totalW, totalH],
    iconAnchor: [cx, totalH],
    popupAnchor: [0, -(totalH + 4)],
  })
}

function MapControls({ tileKey, onTileChange, showLabels, onToggleLabels }: {
  tileKey: TileKey
  onTileChange: (k: TileKey) => void
  showLabels: boolean
  onToggleLabels: () => void
}) {
  const map = useMap()
  const [showLayerMenu, setShowLayerMenu] = useState(false)

  return (
    <>
      {/* Zoom + locate */}
      <div className="leaflet-top leaflet-right" style={{ marginTop: '10px', marginRight: '10px' }}>
        <div
          className="leaflet-control flex flex-col gap-1 p-1 rounded-xl"
          style={{ backgroundColor: '#1e2130ee', border: '1px solid #2e3150', backdropFilter: 'blur(8px)' }}
        >
          <button
            onClick={() => map.zoomIn()}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-80 transition-all"
            style={{ color: '#f0f2ff', backgroundColor: '#252840' }}
            title="Acercar"
          ><ZoomIn size={15} /></button>
          <button
            onClick={() => map.zoomOut()}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-80 transition-all"
            style={{ color: '#f0f2ff', backgroundColor: '#252840' }}
            title="Alejar"
          ><ZoomOut size={15} /></button>
          <div style={{ height: '1px', backgroundColor: '#2e3150', margin: '2px 0' }} />
          <button
            onClick={() => map.flyTo([-33.8, -70.9], 6, { duration: 1.2 })}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-80 transition-all"
            style={{ color: '#f0f2ff', backgroundColor: '#252840' }}
            title="Ver todo Chile"
          ><Locate size={15} /></button>
          <div style={{ height: '1px', backgroundColor: '#2e3150', margin: '2px 0' }} />

          {/* Labels toggle */}
          <button
            onClick={onToggleLabels}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{
              color: showLabels ? '#1e2130' : '#f0f2ff',
              backgroundColor: showLabels ? '#4fff8b' : '#252840',
            }}
            title={showLabels ? 'Ocultar etiquetas' : 'Mostrar etiquetas'}
          ><Tag size={15} /></button>

          {/* Layer switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLayerMenu((v) => !v)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{
                color: showLayerMenu ? '#1e2130' : '#f0f2ff',
                backgroundColor: showLayerMenu ? '#4f7cff' : '#252840',
              }}
              title="Cambiar capa"
            ><Layers size={15} /></button>
            {showLayerMenu && (
              <div
                className="absolute top-0 right-10 flex flex-col gap-1 p-1 rounded-xl z-50"
                style={{ backgroundColor: '#1e2130', border: '1px solid #2e3150', minWidth: '110px' }}
              >
                {(Object.entries(TILE_LAYERS) as [TileKey, typeof TILE_LAYERS[TileKey]][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => { onTileChange(key); setShowLayerMenu(false) }}
                    className="px-3 h-8 rounded-lg text-sm text-left transition-all"
                    style={{
                      backgroundColor: tileKey === key ? '#4f7cff' : 'transparent',
                      color: tileKey === key ? 'white' : '#f0f2ff',
                    }}
                  >
                    {cfg.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function FlyToSucursal({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  map.flyTo([lat, lng], 14, { duration: 1.2 })
  return null
}

export default function MapaGeneral() {
  const navigate = useNavigate()
  const [filterEstado, setFilterEstado] = useState<'todos' | 'activo' | 'inactivo'>('todos')
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number } | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [tileKey, setTileKey] = useState<TileKey>('satellite')
  const [showLabels, setShowLabels] = useState(true)

  const filtered = mockSucursales.filter(
    (s) => filterEstado === 'todos' || s.estado === filterEstado
  )

  return (
    <div className="flex flex-col gap-4" style={{ height: 'calc(100vh - 100px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Mapa General</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {filtered.length} sucursal{filtered.length !== 1 ? 'es' : ''} en el mapa
          </p>
        </div>

        {/* Filtro estado */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <Filter size={14} className="ml-2" style={{ color: 'var(--text-secondary)' }} />
          {(['todos', 'activo', 'inactivo'] as const).map((e) => (
            <button
              key={e}
              onClick={() => setFilterEstado(e)}
              className="h-8 px-3 rounded-lg text-sm font-medium capitalize transition-all"
              style={{
                backgroundColor: filterEstado === e ? 'var(--accent-blue)' : 'transparent',
                color: filterEstado === e ? 'white' : 'var(--text-secondary)',
              }}
            >
              {e === 'todos' ? 'Todas' : e.charAt(0).toUpperCase() + e.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Sidebar lista */}
        <div
          className="w-64 shrink-0 rounded-xl border overflow-y-auto"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
              Sucursales
            </p>
          </div>
          <div>
            {filtered.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelected(s.id)
                  setFlyTarget({ lat: s.latitud, lng: s.longitud })
                }}
                className="w-full text-left px-3 py-2.5 border-b transition-all hover:opacity-80"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: selected === s.id ? 'var(--bg-hover)' : 'transparent',
                  borderLeft: selected === s.id ? `3px solid ${estadoColor[s.estado] ?? 'var(--accent-blue)'}` : '3px solid transparent',
                }}
              >
                <div className="flex items-start gap-2">
                  <span
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: estadoColor[s.estado] ?? '#8b91b0' }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{s.nombre}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{s.ciudad}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.totalEspacios} espacios</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mapa */}
        <div
          className="flex-1 rounded-xl overflow-hidden border relative"
          style={{ borderColor: 'var(--border)' }}
        >
          <MapContainer
            center={[-33.8, -70.9]}
            zoom={6}
            style={{ width: '100%', height: '100%' }}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer
              key={tileKey}
              url={TILE_LAYERS[tileKey].url}
              attribution={TILE_LAYERS[tileKey].attribution}
              maxZoom={19}
            />

            <MapControls
              tileKey={tileKey}
              onTileChange={setTileKey}
              showLabels={showLabels}
              onToggleLabels={() => setShowLabels((v) => !v)}
            />

            {flyTarget && (
              <FlyToSucursal
                lat={flyTarget.lat}
                lng={flyTarget.lng}
                key={`${flyTarget.lat}-${flyTarget.lng}`}
              />
            )}

            {filtered.map((s) => (
              <Marker
                key={`${s.id}-${showLabels}-${selected === s.id}`}
                position={[s.latitud, s.longitud]}
                icon={createLabeledIcon(
                  estadoColor[s.estado] ?? '#8b91b0',
                  s.nombre,
                  showLabels,
                  selected === s.id
                )}
                zIndexOffset={selected === s.id ? 1000 : 0}
                eventHandlers={{
                  click: () => {
                    setSelected(s.id)
                    setFlyTarget({ lat: s.latitud, lng: s.longitud })
                  },
                }}
              >
                <Popup closeButton={false}>
                  <div
                    className="p-3 rounded-xl min-w-52"
                    style={{
                      backgroundColor: '#1e2130',
                      color: '#f0f2ff',
                      border: '1px solid #2e3150',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 size={15} style={{ color: estadoColor[s.estado] }} />
                      <p className="font-semibold text-sm">{s.nombre}</p>
                    </div>
                    <p className="text-xs mb-0.5" style={{ color: '#8b91b0' }}>{s.direccion}</p>
                    <p className="text-xs mb-3" style={{ color: '#8b91b0' }}>{s.ciudad}, {s.region}</p>
                    <div className="flex gap-2 text-xs mb-3">
                      <span
                        className="px-2 py-0.5 rounded-full font-medium"
                        style={{ color: estadoColor[s.estado], backgroundColor: `${estadoColor[s.estado]}22` }}
                      >
                        {s.estado}
                      </span>
                      <span style={{ color: '#8b91b0' }}>{s.totalEspacios} espacios</span>
                    </div>
                    <button
                      onClick={() => navigate(`/sucursales/${s.id}/espacios`)}
                      className="w-full flex items-center justify-center gap-1.5 h-7 rounded-lg text-xs font-medium"
                      style={{ backgroundColor: '#4f7cff', color: 'white' }}
                    >
                      <Eye size={12} />
                      Ver espacios
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Leyenda */}
          <div
            className="absolute bottom-4 left-4 z-[1000] flex flex-col gap-1.5 px-3 py-2 rounded-xl"
            style={{ backgroundColor: '#1e2130cc', border: '1px solid #2e3150', backdropFilter: 'blur(8px)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#8b91b0' }}>Estado</p>
            {Object.entries(estadoColor).map(([estado, color]) => (
              <div key={estado} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="capitalize" style={{ color: '#f0f2ff' }}>{estado}</span>
              </div>
            ))}
          </div>

          {/* Capa activa badge */}
          <div
            className="absolute top-3 left-3 z-[1000] px-2 py-1 rounded-lg text-xs"
            style={{ backgroundColor: '#1e2130cc', color: '#8b91b0', border: '1px solid #2e3150', backdropFilter: 'blur(8px)' }}
          >
            {TILE_LAYERS[tileKey].label}
          </div>
        </div>
      </div>
    </div>
  )
}
