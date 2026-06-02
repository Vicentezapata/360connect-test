// ─── Tipos base ───────────────────────────────────────────────────────────────
export type EstadoGeneral = 'activo' | 'inactivo'

// ─── SUCURSALES ───────────────────────────────────────────────────────────────
export interface Sucursal {
  id: string
  nombre: string
  ciudad: string
  region: string
  estado: EstadoGeneral
  latitud: number
  longitud: number
  direccion?: string
  telefono?: string
  contacto?: string
  totalEspacios?: number
  creadoEn?: string
}

// ─── ESPACIOS_360 ─────────────────────────────────────────────────────────────
export type EspacioEstado = 'processing' | 'ready' | 'error'

export interface Espacio360 {
  id: string
  sucursalId: string
  nombre: string
  orden: number
  fotoUrl?: string
  thumbnailUrl?: string
  estado: EspacioEstado
  creadoEn?: string
}

// ─── HOTSPOTS ─────────────────────────────────────────────────────────────────
export type HotspotTipo = 'pin' | 'poligono' | 'navegacion'
export type HotspotPinTipo = 'navegacion' | 'informacion' | 'documento' | 'url'

export interface HotspotVertice {
  yaw: number
  pitch: number
}

export interface Hotspot {
  id: string
  espacioId: string
  tipo: HotspotTipo
  pinTipo?: HotspotPinTipo
  yaw?: number
  pitch?: number
  verticesYawPitch?: HotspotVertice[]
  titulo?: string
  contenido?: string
  espacioDestinoId?: string
  documentoId?: string
  url?: string
  creadoEn?: string
}

// ─── PLANIMETRIAS ─────────────────────────────────────────────────────────────
export interface MarcadorPlanimetria {
  id: string
  espacioId: string
  x: number
  y: number
  label: string
}

export interface Planimetria {
  id: string
  sucursalId: string
  imagenUrl?: string
  marcadores: MarcadorPlanimetria[]
  versionActual: string
  publicada: boolean
  actualizadoEn?: string
}

export interface HistorialPlanimetria {
  id: string
  planimetriaId: string
  version: string
  comentario: string
  subidoPor: string
  fecha: string
  marcadoresSnapshot?: MarcadorPlanimetria[]
}

// ─── COMUNICACIONES ───────────────────────────────────────────────────────────
export type ComunicacionEstado = 'activo' | 'standby' | 'falla'

export interface Comunicacion {
  id: string
  sucursalId: string
  enlace: string
  proveedor: string
  estado: ComunicacionEstado
  capacidad: string
  ip: string
  observacion: string
  creadoEn?: string
}

// ─── BATERIAS ─────────────────────────────────────────────────────────────────
export type BateriaEstado = 'bueno' | 'regular' | 'critico'

export interface Bateria {
  id: string
  sucursalId: string
  nombre: string
  modelo: string
  capacidad: string
  estado: BateriaEstado
  ultimaRevision: string
  autonomia: string
  observacion: string
  creadoEn?: string
}

// ─── TORRES ───────────────────────────────────────────────────────────────────
export type TorreEstado = 'operativo' | 'mantenimiento' | 'fuera_de_servicio'

export interface Torre {
  id: string
  sucursalId: string
  nombre: string
  tipo: string
  altura: string
  estado: TorreEstado
  ultimaInspeccion: string
  operador: string
  observacion: string
  creadoEn?: string
}

// ─── CATEGORIAS_MENU ──────────────────────────────────────────────────────────
export interface CategoriaMenu {
  id: string
  nombre: string
  tipo: string
  orden: number
  activo: boolean
}

// ─── DOCUMENTOS ───────────────────────────────────────────────────────────────
export type AdjuntableTipo = 'sucursal' | 'espacio' | 'hotspot'

export interface Documento {
  id: string
  nombre: string
  categoriaId: string
  categoriaNombre?: string
  adjuntableId: string
  adjuntableTipo: AdjuntableTipo
  versionActual: string
  tamano: string
  urlMinio?: string
  subidoPor: string
  creadoEn: string
  tags?: string[]
}

export interface VersionDocumento {
  id: string
  documentoId: string
  version: string
  comentario: string
  urlMinio?: string
  subidoPor: string
  fecha: string
  tamano: string
}

// ─── REPORTES_CAMPO ───────────────────────────────────────────────────────────
export type ReporteTipo = 'falla' | 'inspeccion'
export type ReporteCriticidad = 'alta' | 'media' | 'baja'
export type ReporteStatus = 'nuevo' | 'pendiente_revision' | 'revisado'

export interface ReporteCampo {
  id: string
  sucursalId: string
  tecnicoId: string
  tecnicoNombre?: string
  tipo: ReporteTipo
  criticidad: ReporteCriticidad
  descripcion: string
  datosFalla?: Record<string, unknown>
  status: ReporteStatus
  fotosKeys: string[]
  syncedAt?: string
  creadoEn: string
  comentarioRevision?: string
  revisadoPor?: string
}

// ─── INFORMES (PDF manuales) ──────────────────────────────────────────────────
export type InformeTipo = 'falla' | 'inspeccion' | 'mantenimiento' | 'auditoria'

export interface Informe {
  id: string
  sucursalId: string
  titulo: string
  tipo: InformeTipo
  fecha: string
  pdfUrl?: string
  creadoPor: string
}

// ─── USUARIOS & ROLES ─────────────────────────────────────────────────────────
export interface Rol {
  id: string
  nombre: string
  descripcion?: string
}

export interface Usuario {
  id: string
  nombre: string
  email: string
  rolId: string
  rolNombre?: string
  estado: EstadoGeneral
  creadoEn?: string
  sucursalesIds?: string[]
  sucursalesNombres?: string
}

// ─── AUDIT_LOG ────────────────────────────────────────────────────────────────
export type AuditAccion = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'DOWNLOAD'

export interface AuditLogEntry {
  id: string
  fecha: string
  usuarioId: string
  usuarioNombre?: string
  accion: AuditAccion
  recurso: string
  recursoId: string
  valorAnterior?: Record<string, unknown>
  valorNuevo?: Record<string, unknown>
  ip: string
}

// ─── NOTIFICACIONES ───────────────────────────────────────────────────────────
export type NotificacionTipo = 'alerta' | 'informe' | 'documento' | 'sistema'

export interface Notificacion {
  id: string
  tipo: NotificacionTipo
  titulo: string
  mensaje: string
  fecha: string
  leida: boolean
  link?: string
}

// ─── INSTANCIA_CONFIG ─────────────────────────────────────────────────────────
export interface InstanciaConfig {
  id: string
  nombreEmpresa: string
  logoUrl?: string
  colorPrimario: string
  colorSecundario: string
  dominio?: string
  timezone: string
  setupCompletado: boolean
}

// ─── ACTIVIDAD (for dashboard feed) ──────────────────────────────────────────
export interface ActividadItem {
  id: string
  icon: string
  texto: string
  tiempo: string
}
