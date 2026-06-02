# Epic PRD — Plataforma de Tour Virtual de Sucursales

> **Skill aplicada:** breakdown-epic-pm
> **Fecha:** 2026-05-29
> **Estado:** En definición

---

## 1. Nombre del Epic

**Virtual Tour Platform** — Sistema de Tour Virtual 360° con Portal de Administración para Sucursales

---

## 2. Goal

### Problema
La organización gestiona actualmente ~20 sucursales distribuidas en el país usando un software legado que no permite administrar el contenido de manera autónoma, carece de capacidad para diseñar planos interactivos, no tiene una arquitectura web moderna y no puede ser instalado como instancia independiente por cliente. Los técnicos de campo no pueden acceder a la información de infraestructura de forma confiable cuando tienen baja conectividad.

### Solución
Desarrollar desde cero una plataforma web moderna compuesta por:
1. Un **viewer / app de campo** (con autenticación de usuario) de tour virtual 360° con menú contextual por sucursal
2. Un **portal de administración** que permite gestionar sucursales, subir fotos 360°, diseñar planos en canvas, gestionar documentos y configurar toda la experiencia
3. Un modelo de **despliegue on-premise** empaquetado en Docker Compose, instalable en el servidor de cada cliente como instancia independiente

### Impacto esperado
- Reducción del tiempo de onboarding de nuevo personal gracias al tour virtual interactivo
- Autonomía total del equipo de TI del cliente para actualizar contenido sin depender del proveedor
- Disponibilidad de información técnica de infraestructura desde campo (offline)
- Base escalable para agregar más sucursales sin cambios de infraestructura

---

## 3. Personas de Usuario

### U1 — Técnico de Campo / Operador
- Visita sucursales físicamente o las consulta remotamente
- Necesita ver el estado de comunicaciones, baterías, torres y documentación técnica
- Puede tener conexión limitada o nula en terreno
- Se autentica con usuario y contraseña para acceder al **viewer / app de campo** desde Chrome o Firefox
- Solo ve las sucursales asignadas a su scope geográfico

### U2 — Administrador de Contenido (Admin)
- Gestiona el contenido de las sucursales: fotos 360°, planos, documentos, informes
- Diseña y publica planimetrías interactivas desde el portal admin
- Puede trabajar desde oficina o en campo con baja conectividad
- Necesita control granular de qué está publicado y qué no

### U3 — Administrador del Sistema (Super Admin)
- Instala y configura la instancia en el servidor del cliente
- Gestiona usuarios, roles y permisos de toda la plataforma
- Configura el branding (logo, colores, nombre empresa) en el setup wizard
- Responsable de backups y mantenimiento del sistema

### U4 — Gerente / Supervisor
- Consulta informes y documentación de sucursales de forma ocasional
- No sube contenido, solo visualiza
- Accede al **viewer / app de campo** (con sus credenciales) o desde un panel de solo lectura en el admin

---

## 4. User Journeys de Alto Nivel

### J1 — Ver Tour Virtual de una Sucursal
```
Usuario abre el viewer → pantalla de login (V-09) → introduce credenciales
→ autenticado: visualiza solo sus sucursales asignadas (scope geográfico)
→ selecciona sucursal → carga visor 360° (primer espacio)
→ navega entre espacios usando hotspots en la imagen
→ abre menú contextual → selecciona [COMUNICACIONES]
→ panel lateral deslizante muestra tabla de enlaces, proveedor, estado
→ descarga documento técnico adjunto en PDF
→ vuelve al visor, continúa navegando
```

### J2 — Administrar una Sucursal
```
Admin entra al portal → dashboard con resumen
→ sección Sucursales → selecciona sucursal
→ pestaña "Espacios 360°" → sube foto 360° (drag & drop)
→ sistema valida, genera thumbnail, muestra progreso
→ foto disponible en el listado de espacios
→ pestaña "Planimetría" → abre editor canvas
→ sube imagen base del plano → posiciona marcadores
→ asigna cada marcador a un espacio 360°
→ guarda versión con comentario → publica planimetría
```

### J3 — Trabajar Offline en Campo
```
Admin abre el portal admin (previamente cargado)
→ sin conexión: banner "Modo offline"
→ edita datos de infraestructura de una sucursal
→ los cambios se guardan en IndexedDB
→ cuando vuelve la conexión: banner "Sincronizando..."
→ cambios se envían a la API automáticamente
→ confirmación visual de sincronización exitosa
```

### J4 — Instalar Nueva Instancia (Cliente Nuevo)
```
Técnico recibe credenciales del servidor del cliente
→ ejecuta script: curl -fsSL https://install.ejemplo.com | bash
→ wizard de setup: nombre empresa, logo, colores, dominio
→ se configura Docker Compose, SSL automático (Let's Encrypt)
→ se migran fotos 360° existentes desde ruta local
→ sistema listo en < 30 minutos
```

---

## 5. Requerimientos

### Funcionales

#### Viewer / App de Campo (con autenticación)
- **RF-01**: Listado de sucursales con portada, nombre, ciudad y estado (activo/inactivo)
- **RF-02**: Filtrado de sucursales por región y ciudad
- **RF-03**: Visor 360° usando Photo Sphere Viewer con navegación por hotspots
- **RF-04**: Mini-mapa de planimetría superpuesto en el visor (overlay inferior)
- **RF-05**: Menú contextual con 8 ítems: COMUNICACIONES, BATERÍAS, TORRE, INFORMES, PLANIMETRÍA, BIBLIOTECA, INFORMACIÓN, SALIDA
- **RF-06**: Panel lateral deslizante con información de infraestructura por sucursal
- **RF-07**: Descarga de documentos PDF directamente desde el panel lateral
- **RF-08**: Navegación entre espacios 360° mediante hotspots configurados
- **RF-09**: Funcionalidad offline: visualización de sucursales previamente cargadas

#### Portal Admin — Sucursales
- **RF-10**: CRUD completo de sucursales (crear, editar, activar/desactivar)
- **RF-11**: Upload de fotos 360° con validación de resolución mínima (≥ 4096×2048)
- **RF-12**: Generación automática de thumbnail WebP en background al subir foto 360°
- **RF-13**: Reordenamiento de espacios 360° por drag & drop
- **RF-14**: Editor de hotspots sobre el visor 360°: doble clic para añadir, modal de configuración
- **RF-15**: Tipos de hotspot: Navegación a otro espacio | Información | Documento | URL externa | **Área Poligonal (equipo)**
- **RF-16**: Editor de planimetría con canvas (React-Konva): subir imagen base, colocar marcadores, asignar a espacio 360°
- **RF-17**: Versionado de planimetrías con historial y rollback
- **RF-18**: CRUD de infraestructura: comunicaciones, baterías, torres por sucursal

#### Portal Admin — Documentos y Biblioteca
- **RF-19**: Upload de PDFs con categorización y versioning
- **RF-20**: Historial de versiones de documentos con comentario de cambio
- **RF-21**: Búsqueda full-text de documentos y biblioteca
- **RF-22**: Sistema de etiquetas (tags) para documentos
- **RF-23**: Upload de informes PDF por sucursal con tipo y fecha

#### Módulo de Inspecciones y Reportes de Campo *(nuevo)*
- **RF-34**: Formulario de reporte de inspección/falla accesible desde el viewer, operable completamente offline
- **RF-35**: Captura de fotografías adjuntas al reporte usando la cámara del dispositivo móvil en campo
- **RF-36**: Cola de sincronización diferida (`outbox_reportes` en IndexedDB) — los reportes se envían al servidor incluso si la conexión se restaura después de que la app fue cerrada (Background Sync API)
- **RF-37**: Workflow de estado de informes: `nuevo` → `pendiente_revisión` → `revisado`, con indicadores visuales ("Nuevo" badge) en el portal admin
- **RF-38**: Filtros avanzados en gestión de informes: últimos 7/30 días, tipo (falla/inspección), estado (pendiente/revisado)
- **RF-39**: Hotspot de área poligonal en el visor 360°: el admin traza el contorno de un equipo haciendo clic en vértices; se almacena como array de coordenadas Yaw/Pitch; en el viewer se muestra como overlay semitransparente que se ilumina al pasar el cursor
- **RF-40**: Documentos adjuntables en tres niveles: sucursal, espacio 360° o hotspot/equipo individual (relación polimórfica `adjuntable_id / adjuntable_type`)
- **RF-41**: Alcance geográfico de usuarios: el Super Admin puede vincular un usuario a una o más sucursales específicas, limitando su acceso y edición solo a esas sucursales

#### Portal Admin — Usuarios y Configuración
- **RF-24**: CRUD de usuarios con asignación de roles
- **RF-25**: Sistema de permisos granulares por recurso/acción
- **RF-26**: Audit log: quién, qué, cuándo, dato anterior vs nuevo
- **RF-27**: Dashboard con métricas: sucursales activas, documentos recientes, visitas
- **RF-28**: Configuración de instancia: nombre empresa, logo, colores, dominio
- **RF-29**: Notificaciones: nuevos documentos, informes, mantenimientos pendientes

#### Instalación y Operación
- **RF-30**: Script de instalación automatizado (Docker Compose + setup wizard)
- **RF-31**: Migración de fotos 360° existentes desde ruta local
- **RF-32**: Backup automático diario (pg_dump → MinIO)
- **RF-33**: SSL automático con Let's Encrypt (Certbot)

### No Funcionales

- **RNF-01**: Soportar 50 usuarios concurrentes en el viewer sin degradación de performance
- **RNF-02**: Tiempo de carga inicial del viewer ≤ 3 segundos en conexión 10 Mbps
- **RNF-03**: Fotos 360° cargadas con tiles progresivos (no bloquear UI mientras carga la imagen completa)
- **RNF-04**: Disponible en Chrome (latest-2) y Firefox (latest-2)
- **RNF-05**: HTTPS obligatorio en todas las rutas
- **RNF-06**: Tokens JWT con expiración de 15 min + refresh token rotativo (7 días) en cookie HttpOnly
- **RNF-07**: Archivos servidos exclusivamente mediante presigned URLs con expiración (no acceso público directo a MinIO)
- **RNF-08**: Inputs validados con Zod en backend; ORM Prisma para prevenir SQL injection
- **RNF-09**: Admin funcional en modo offline (PWA): ediciones se sincronizan al reconectar
- **RNF-10**: Viewer funcional en modo offline para sucursales previamente visitadas
- **RNF-15**: Los reportes de campo generados offline se sincronizan aunque la app haya sido cerrada y reabierta (Background Sync API — incluso si el dispositivo recuperó conexión en segundo plano)
- **RNF-16**: Password mínimo 8 caracteres con al menos un número y un símbolo; bloqueado con rate limiting a nivel de IP (máx. 10 intentos/min) para prevenir fuerza bruta
- **RNF-17**: El historial de auditoría registra todos los logins, logouts y cambios realizados por administradores incluyendo el valor anterior y el nuevo en formato JSON
- **RNF-11**: Rotación automática de logs de aplicación (Winston, retención 30 días)
- **RNF-12**: Todas las acciones de escritura registradas en AUDIT_LOG
- **RNF-13**: Instalación completa en < 30 minutos en servidor con Docker disponible
- **RNF-14**: Lighthouse Performance Score ≥ 90 en viewer / app de campo

---

## 6. Métricas de Éxito (KPIs)

| Métrica | Baseline | Target |
|---------|----------|--------|
| Tiempo promedio de carga del viewer | — | ≤ 3 segundos |
| Sucursales gestionadas vía admin | 0 (manual) | 100% |
| Tiempo de instalación en nuevo cliente | días | < 30 minutos |
| Documentos accesibles desde el viewer | 0 | 100% |
| Disponibilidad del sistema | — | ≥ 99.5% mensual |
| Cobertura de tests E2E (Chrome + Firefox) | 0% | ≥ 80% flujos críticos |

---

## 7. Fuera de Alcance

- Integración con LDAP / Active Directory (fase futura)
- Generación automática de informes (solo upload de PDFs en esta versión; los reportes de campo son formularios estructurados, no generación automática)
- Multi-tenancy real (múltiples organizaciones en una misma instancia)
- App móvil nativa (iOS / Android) — la PWA cubre la necesidad offline
- Captura de nuevas fotos 360° con cámara 360° (se migran las existentes; el módulo de inspecciones captura fotos estándar del dispositivo, no fotos esféricas)
- Soporte para Internet Explorer, Safari o Edge ≤ 90
- Sistema de notificaciones push en tiempo real entre usuarios (WebSockets de notificación)
- Integración con sistemas ERP o de ticketing externos (ServiceNow, JIRA, etc.)
- SSO / Single Sign-On con proveedores externos (Google, Microsoft, Okta) en esta versión
- Dashboard de monitoreo en tiempo real de estados de equipos (requeriría agentes de telemetría fuera del alcance del proyecto)

---

## 8. Valor de Negocio

**Alto** — La plataforma reemplaza un sistema legado no mantenible, habilita la autonomía operacional del cliente para gestionar su propio contenido, y provee un modelo de instalación reproducible que reduce el costo de onboarding de nuevos clientes a menos de 30 minutos.