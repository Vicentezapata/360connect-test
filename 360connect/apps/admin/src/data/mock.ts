import type {
  Sucursal, Espacio360, Documento, Usuario, AuditLogEntry,
  HistorialPlanimetria, Comunicacion, Bateria, Torre,
  ReporteCampo, Informe, Notificacion, ActividadItem,
} from '../types/models'

export const mockSucursales: Sucursal[] = [
  { id: '1', nombre: 'Centro Santiago', ciudad: 'Santiago', region: 'Metropolitana', estado: 'activo', latitud: -33.45, longitud: -70.66, direccion: 'Av. Libertador Bernardo O\'Higgins 1234', telefono: '+56 2 2345 6789', totalEspacios: 8 },
  { id: '2', nombre: 'Sucursal Providencia', ciudad: 'Providencia', region: 'Metropolitana', estado: 'activo', latitud: -33.42, longitud: -70.62, direccion: 'Av. Providencia 2350', telefono: '+56 2 2456 7890', totalEspacios: 5 },
  { id: '3', nombre: 'Valparaíso Centro', ciudad: 'Valparaíso', region: 'Valparaíso', estado: 'inactivo', latitud: -33.04, longitud: -71.62, direccion: 'Plaza Sotomayor 45', telefono: '+56 32 2123 456', totalEspacios: 3 },
  { id: '4', nombre: 'Concepción Norte', ciudad: 'Concepción', region: 'Biobío', estado: 'activo', latitud: -36.82, longitud: -73.04, direccion: 'Av. Los Carrera 780', telefono: '+56 41 2567 890', totalEspacios: 6 },
  { id: '5', nombre: 'Antofagasta Puerto', ciudad: 'Antofagasta', region: 'Antofagasta', estado: 'activo', latitud: -23.65, longitud: -70.39, direccion: 'Balmaceda 2515', telefono: '+56 55 2345 678', totalEspacios: 4 },
]

export const mockEspacios: Espacio360[] = [
  { id: '1', sucursalId: '1', nombre: 'Sala Principal', orden: 1, estado: 'ready', thumbnailUrl: undefined },
  { id: '2', sucursalId: '1', nombre: 'Sala de Reuniones', orden: 2, estado: 'ready', thumbnailUrl: undefined },
  { id: '3', sucursalId: '1', nombre: 'Bodega', orden: 3, estado: 'processing', thumbnailUrl: undefined },
  { id: '4', sucursalId: '1', nombre: 'Recepción', orden: 4, estado: 'ready', thumbnailUrl: undefined },
]

export const mockDocumentos: Documento[] = [
  { id: '1', nombre: 'Manual de Operaciones v3.pdf', categoriaId: 'cat-1', categoriaNombre: 'Manual', adjuntableId: '1', adjuntableTipo: 'sucursal', versionActual: '3.0', tamano: '2.4 MB', subidoPor: 'María González', creadoEn: '2024-01-15', tags: ['operaciones'] },
  { id: '2', nombre: 'Protocolo de Seguridad.pdf', categoriaId: 'cat-2', categoriaNombre: 'Protocolo', adjuntableId: '1', adjuntableTipo: 'sucursal', versionActual: '1.2', tamano: '856 KB', subidoPor: 'Juan Pérez', creadoEn: '2024-01-10', tags: ['seguridad'] },
  { id: '3', nombre: 'Guía Técnica Instalación.docx', categoriaId: 'cat-3', categoriaNombre: 'Técnico', adjuntableId: '1', adjuntableTipo: 'espacio', versionActual: '2.1', tamano: '1.1 MB', subidoPor: 'Carlos Ruiz', creadoEn: '2024-01-08', tags: ['técnico', 'instalación'] },
  { id: '4', nombre: 'Plano Estructural Centro.dwg', categoriaId: 'cat-4', categoriaNombre: 'Plano', adjuntableId: '1', adjuntableTipo: 'sucursal', versionActual: '4.0', tamano: '5.2 MB', subidoPor: 'Ana Torres', creadoEn: '2023-12-20', tags: ['plano', 'estructura'] },
  { id: '5', nombre: 'Contrato Mantenimiento.pdf', categoriaId: 'cat-5', categoriaNombre: 'Legal', adjuntableId: '1', adjuntableTipo: 'sucursal', versionActual: '1.0', tamano: '432 KB', subidoPor: 'María González', creadoEn: '2023-12-15', tags: ['legal'] },
  { id: '6', nombre: 'Reporte Mensual Dic 2023.xlsx', categoriaId: 'cat-6', categoriaNombre: 'Reporte', adjuntableId: '1', adjuntableTipo: 'sucursal', versionActual: '1.0', tamano: '780 KB', subidoPor: 'Juan Pérez', creadoEn: '2023-12-31', tags: ['reporte'] },
]

export const mockUsuarios: Usuario[] = [
  { id: '1', nombre: 'María González', email: 'maria@360connect.cl', rolId: 'rol-1', rolNombre: 'Super Admin', sucursalesNombres: 'Todas', estado: 'activo' },
  { id: '2', nombre: 'Juan Pérez', email: 'juan@360connect.cl', rolId: 'rol-2', rolNombre: 'Admin', sucursalesIds: ['1', '2'], sucursalesNombres: 'Centro Santiago, Providencia', estado: 'activo' },
  { id: '3', nombre: 'Carlos Ruiz', email: 'carlos@360connect.cl', rolId: 'rol-3', rolNombre: 'Técnico', sucursalesIds: ['3'], sucursalesNombres: 'Valparaíso Centro', estado: 'activo' },
  { id: '4', nombre: 'Ana Torres', email: 'ana@360connect.cl', rolId: 'rol-4', rolNombre: 'Visualizador', sucursalesIds: ['4'], sucursalesNombres: 'Concepción Norte', estado: 'inactivo' },
  { id: '5', nombre: 'Pedro Soto', email: 'pedro@360connect.cl', rolId: 'rol-3', rolNombre: 'Técnico', sucursalesIds: ['5'], sucursalesNombres: 'Antofagasta Puerto', estado: 'activo' },
]

export const mockAuditLog: AuditLogEntry[] = [
  { id: '1', fecha: '2024-01-15 14:32', usuarioId: '1', usuarioNombre: 'María González', accion: 'CREATE', recurso: 'Sucursal', recursoId: 'suc_001', ip: '192.168.1.10', valorNuevo: { nombre: 'Centro Santiago', ciudad: 'Santiago' } },
  { id: '2', fecha: '2024-01-15 13:21', usuarioId: '2', usuarioNombre: 'Juan Pérez', accion: 'UPDATE', recurso: 'Espacio', recursoId: 'esp_004', ip: '192.168.1.15', valorAnterior: { nombre: 'Sala 4' }, valorNuevo: { nombre: 'Recepción' } },
  { id: '3', fecha: '2024-01-15 12:05', usuarioId: '3', usuarioNombre: 'Carlos Ruiz', accion: 'LOGIN', recurso: 'Sistema', recursoId: '—', ip: '10.0.0.5' },
  { id: '4', fecha: '2024-01-15 11:44', usuarioId: '4', usuarioNombre: 'Ana Torres', accion: 'DELETE', recurso: 'Documento', recursoId: 'doc_012', ip: '192.168.1.22', valorAnterior: { nombre: 'Archivo antiguo.pdf' } },
  { id: '5', fecha: '2024-01-15 10:30', usuarioId: '1', usuarioNombre: 'María González', accion: 'UPDATE', recurso: 'Usuario', recursoId: 'usr_003', ip: '192.168.1.10', valorAnterior: { estado: 'inactivo' }, valorNuevo: { estado: 'activo' } },
  { id: '6', fecha: '2024-01-14 18:55', usuarioId: '5', usuarioNombre: 'Pedro Soto', accion: 'CREATE', recurso: 'Documento', recursoId: 'doc_015', ip: '10.0.0.8', valorNuevo: { nombre: 'Reporte Enero.pdf' } },
  { id: '7', fecha: '2024-01-14 17:30', usuarioId: '2', usuarioNombre: 'Juan Pérez', accion: 'LOGIN', recurso: 'Sistema', recursoId: '—', ip: '192.168.1.15' },
  { id: '8', fecha: '2024-01-14 16:12', usuarioId: '3', usuarioNombre: 'Carlos Ruiz', accion: 'UPDATE', recurso: 'Planimetría', recursoId: 'pla_002', ip: '10.0.0.5', valorAnterior: { version: 'v3.1' }, valorNuevo: { version: 'v3.2' } },
]

export const mockPlanimetriaVersiones: HistorialPlanimetria[] = [
  { id: '1', planimetriaId: 'pla-1', version: 'v4.0', fecha: '2024-01-15', comentario: 'Actualización sala principal y pasillos', subidoPor: 'María González' },
  { id: '2', planimetriaId: 'pla-1', version: 'v3.2', fecha: '2023-12-20', comentario: 'Corrección medidas bodega', subidoPor: 'Juan Pérez' },
  { id: '3', planimetriaId: 'pla-1', version: 'v3.1', fecha: '2023-11-10', comentario: 'Agregados nuevos accesos de emergencia', subidoPor: 'Carlos Ruiz' },
  { id: '4', planimetriaId: 'pla-1', version: 'v3.0', fecha: '2023-10-05', comentario: 'Rediseño completo planta baja', subidoPor: 'María González' },
]

export const mockActividad: ActividadItem[] = [
  { id: '1', icon: '🏢', texto: 'Nueva sucursal "Antofagasta Puerto" creada', tiempo: 'Hace 2 horas' },
  { id: '2', icon: '📸', texto: 'Espacio "Bodega" actualizado en Centro Santiago', tiempo: 'Hace 3 horas' },
  { id: '3', icon: '👤', texto: 'Usuario "Pedro Soto" agregado al sistema', tiempo: 'Hace 5 horas' },
  { id: '4', icon: '🗺️', texto: 'Planimetría v4.0 publicada para Centro Santiago', tiempo: 'Hace 1 día' },
  { id: '5', icon: '📄', texto: 'Documento "Manual de Operaciones v3" subido', tiempo: 'Hace 1 día' },
]

export const mockComunicaciones: Comunicacion[] = [
  { id: '1', sucursalId: '1', enlace: 'Enlace Principal MPLS', proveedor: 'Claro', estado: 'activo', capacidad: '100 Mbps', ip: '192.168.1.1', observacion: 'Principal' },
  { id: '2', sucursalId: '1', enlace: 'Enlace Backup 4G', proveedor: 'Entel', estado: 'standby', capacidad: '50 Mbps', ip: '10.0.0.1', observacion: 'Respaldo automático' },
  { id: '3', sucursalId: '2', enlace: 'Fibra Óptica', proveedor: 'Movistar', estado: 'activo', capacidad: '200 Mbps', ip: '172.16.0.1', observacion: '' },
  { id: '4', sucursalId: '4', enlace: 'Enlace ADSL', proveedor: 'VTR', estado: 'falla', capacidad: '20 Mbps', ip: '192.168.2.1', observacion: 'En mantenimiento' },
]

export const mockBaterias: Bateria[] = [
  { id: '1', sucursalId: '1', nombre: 'Batería UPS Principal', modelo: 'APC Smart-UPS 3000', capacidad: '3000 VA', estado: 'bueno', ultimaRevision: '2024-01-10', autonomia: '45 min', observacion: '' },
  { id: '2', sucursalId: '1', nombre: 'Batería Rack', modelo: 'CyberPower OR1500ELCDRM1U', capacidad: '1500 VA', estado: 'regular', ultimaRevision: '2023-11-20', autonomia: '25 min', observacion: 'Requiere revisión en 3 meses' },
  { id: '3', sucursalId: '2', nombre: 'UPS Sala Servidores', modelo: 'Eaton 5PX 2200', capacidad: '2200 VA', estado: 'bueno', ultimaRevision: '2024-01-05', autonomia: '30 min', observacion: '' },
  { id: '4', sucursalId: '4', nombre: 'Batería Emergencia', modelo: 'Powerware PW9125', capacidad: '1000 VA', estado: 'critico', ultimaRevision: '2023-08-15', autonomia: '10 min', observacion: 'Requiere reemplazo urgente' },
]

export const mockTorres: Torre[] = [
  { id: '1', sucursalId: '1', nombre: 'Torre Principal', tipo: 'Autosoportada', altura: '30m', estado: 'operativo', ultimaInspeccion: '2024-01-12', operador: 'Claro', observacion: '' },
  { id: '2', sucursalId: '1', nombre: 'Mástil Backup', tipo: 'Mástil', altura: '6m', estado: 'operativo', ultimaInspeccion: '2024-01-12', operador: 'Propio', observacion: '' },
  { id: '3', sucursalId: '3', nombre: 'Torre Mono', tipo: 'Monopolo', altura: '45m', estado: 'mantenimiento', ultimaInspeccion: '2023-10-01', operador: 'Entel', observacion: 'Inspección programada Feb 2024' },
]

// REPORTES_CAMPO — registros de terreno creados por técnicos desde el viewer
export const mockReportesCampo: ReporteCampo[] = [
  { id: '1', sucursalId: '1', tecnicoId: '5', tecnicoNombre: 'Pedro Soto', tipo: 'falla', criticidad: 'alta', descripcion: 'Falla en enlace principal MPLS, sin conectividad desde las 09:00', status: 'nuevo', fotosKeys: ['foto_001.jpg', 'foto_002.jpg'], creadoEn: '2024-01-15 09:32' },
  { id: '2', sucursalId: '1', tecnicoId: '3', tecnicoNombre: 'Carlos Ruiz', tipo: 'inspeccion', criticidad: 'baja', descripcion: 'Inspección rutinaria completada. Todo en orden.', status: 'revisado', fotosKeys: ['foto_010.jpg'], creadoEn: '2024-01-14 14:20', revisadoPor: 'María González' },
  { id: '3', sucursalId: '2', tecnicoId: '5', tecnicoNombre: 'Pedro Soto', tipo: 'falla', criticidad: 'media', descripcion: 'UPS en sala de servidores emitiendo alarma sonora', status: 'pendiente_revision', fotosKeys: ['foto_020.jpg', 'foto_021.jpg', 'foto_022.jpg'], creadoEn: '2024-01-14 11:05' },
  { id: '4', sucursalId: '4', tecnicoId: '3', tecnicoNombre: 'Carlos Ruiz', tipo: 'inspeccion', criticidad: 'alta', descripcion: 'Batería en estado crítico detectada durante inspección', status: 'nuevo', fotosKeys: ['foto_030.jpg', 'foto_031.jpg'], creadoEn: '2024-01-13 16:45' },
  { id: '5', sucursalId: '1', tecnicoId: '5', tecnicoNombre: 'Pedro Soto', tipo: 'inspeccion', criticidad: 'baja', descripcion: 'Revisión mensual equipos activos completada sin novedades', status: 'revisado', fotosKeys: [], creadoEn: '2024-01-10 10:00', revisadoPor: 'Juan Pérez' },
]

// INFORMES — PDFs de informes manuales subidos por admins
export const mockInformes: Informe[] = [
  { id: '1', sucursalId: '1', titulo: 'Informe Mensual Enero 2024', tipo: 'inspeccion', fecha: '2024-01-31', creadoPor: 'María González', pdfUrl: '/docs/informe-ene-2024.pdf' },
  { id: '2', sucursalId: '1', titulo: 'Reporte Falla MPLS Enero', tipo: 'falla', fecha: '2024-01-16', creadoPor: 'Juan Pérez', pdfUrl: '/docs/reporte-mpls.pdf' },
  { id: '3', sucursalId: '2', titulo: 'Informe Mantenimiento Preventivo', tipo: 'mantenimiento', fecha: '2024-01-20', creadoPor: 'Juan Pérez', pdfUrl: '/docs/mant-prev-2024.pdf' },
]

export const mockNotificaciones: Notificacion[] = [
  { id: '1', tipo: 'alerta', titulo: 'Batería crítica en Concepción Norte', mensaje: 'La batería de emergencia requiere reemplazo urgente', fecha: '2024-01-15 09:45', leida: false, link: '/sucursales/4/baterias' },
  { id: '2', tipo: 'informe', titulo: 'Nuevo reporte de falla', mensaje: 'Pedro Soto reportó falla en enlace MPLS en Centro Santiago', fecha: '2024-01-15 09:32', leida: false, link: '/sucursales/1/informes' },
  { id: '3', tipo: 'documento', titulo: 'Manual de Operaciones actualizado', mensaje: 'Se subió la versión 3.0 del Manual de Operaciones', fecha: '2024-01-15 08:00', leida: true, link: '/documentos' },
  { id: '4', tipo: 'informe', titulo: 'Reporte de inspección revisado', mensaje: 'La inspección en Sucursal Providencia fue marcada como revisada', fecha: '2024-01-14 14:30', leida: true, link: '/sucursales/2/informes' },
  { id: '5', tipo: 'sistema', titulo: 'Sistema actualizado a v2.1.0', mensaje: 'Se realizó actualización del sistema con nuevas funcionalidades', fecha: '2024-01-13 22:00', leida: true, link: '/configuracion' },
]
