# Historias de Usuario — Virtual Tour Platform

> **Fecha:** 2026-05-29
> **Referencia:** `docs/plan/virtual-tour-platform/epic.md`

---

## Épicas y Personas

| Persona | Descripción |
|---------|-------------|
| **U1 — Técnico** | Operador que consulta el tour y la información técnica de las sucursales |
| **U2 — Admin** | Administrador de contenido que gestiona el portal |
| **U3 — Super Admin** | Administrador del sistema (instalación, usuarios, branding) |
| **U4 — Gerente** | Consultor/supervisor que solo visualiza |

---

## HU-01 — VIEWER: Navegar el Tour de una Sucursal

> **Como** técnico de campo (U1),
> **quiero** ver el tour virtual 360° de una sucursal desde mi navegador,
> **para** familiarizarme con la distribución física sin necesidad de ir presencialmente.

**Criterios de aceptación:**
- [ ] Al acceder al viewer, se presenta la pantalla de login (V-09) si no hay sesión activa
- [ ] El técnico se autentica con email y contraseña; un token JWT válido permite el acceso
- [ ] Tras login exitoso, el listado muestra **solo las sucursales asignadas** al scope geográfico del usuario
- [ ] Se muestra una lista de sucursales con portada thumbnail, nombre y ciudad
- [ ] Al hacer clic en una sucursal, carga el visor 360° del primer espacio
- [ ] El visor es fullscreen y funciona con mouse (drag) y touch (swipe)
- [ ] Se pueden ver los hotspots de navegación sobre la imagen
- [ ] Al hacer clic en un hotspot de navegación, transiciona al espacio correspondiente
- [ ] El tiempo de carga inicial del viewer es < 3 segundos en conexión 10 Mbps

---

## HU-02 — VIEWER: Consultar Información de Comunicaciones

> **Como** técnico de campo (U1),
> **quiero** ver los datos de comunicaciones de la sucursal desde el viewer,
> **para** diagnosticar problemas de red sin tener que buscar en documentos separados.

**Criterios de aceptación:**
- [ ] El menú contextual del viewer incluye el ítem **COMUNICACIONES**
- [ ] Al seleccionarlo, se abre un panel lateral deslizante
- [ ] El panel muestra: enlace, proveedor, ancho de banda, estado (activo/inactivo), IP
- [ ] Se pueden descargar documentos PDF adjuntos desde el panel
- [ ] El panel se cierra con botón X o haciendo clic fuera

---

## HU-03 — VIEWER: Consultar Baterías y Torre

> **Como** técnico de campo (U1),
> **quiero** ver el estado de las baterías y la torre de la sucursal,
> **para** planificar mantenimientos preventivos.

**Criterios de aceptación:**
- [ ] El menú contextual incluye los ítems **BATERÍAS** y **TORRE**
- [ ] Panel Baterías muestra: banco, capacidad Ah, voltaje, fecha último mantenimiento
- [ ] Panel Torre muestra: altura, tipo de antena, última inspección
- [ ] Los campos de datos técnicos son extensibles (admiten datos adicionales en formato JSON)

---

## HU-04 — VIEWER: Descargar Informes y Documentos de Biblioteca

> **Como** gerente (U4),
> **quiero** descargar informes y documentos técnicos de una sucursal desde el viewer,
> **para** revisarlos sin necesidad de acceder al portal admin.

**Criterios de aceptación:**
- [ ] El menú contextual incluye **INFORMES** y **BIBLIOTECA**
- [ ] Los PDFs se descargan mediante presigned URL con expiración de 15 minutos
- [ ] Los documentos están organizados por categoría
- [ ] La descarga funciona directamente en el navegador **sin un segundo login** (las presigned URLs no requieren autenticación adicional)

---

## HU-05 — VIEWER: Ver la Planimetría de la Sucursal

> **Como** técnico (U1),
> **quiero** ver el plano interactivo de la sucursal superpuesto en el visor,
> **para** ubicarme espacialmente dentro de las instalaciones.

**Criterios de aceptación:**
- [ ] El menú contextual incluye **PLANIMETRÍA**
- [ ] El mini-mapa de la planimetría se muestra como overlay en la esquina inferior del visor
- [ ] Al seleccionar PLANIMETRÍA del menú, se muestra el plano completo con marcadores de espacios
- [ ] Los marcadores son interactivos: al hacer clic, navega al espacio 360° correspondiente
- [ ] El espacio actual se resalta visualmente en el plano

---

## HU-06 — VIEWER: Usar el Tour sin Conexión a Internet

> **Como** técnico de campo (U1),
> **quiero** poder consultar sucursales que ya visité anteriormente incluso sin internet,
> **para** acceder a información técnica en zonas con baja o nula conectividad.

**Criterios de aceptación:**
- [ ] La app muestra un banner "Modo Offline" cuando no hay conexión
- [ ] Las sucursales previamente visitadas están disponibles offline (thumbnails + datos)
- [ ] Los documentos descargados previamente están accesibles offline
- [ ] La app no muestra errores críticos al navegar en modo offline

---

## HU-07 — ADMIN: Subir una Foto 360° a una Sucursal

> **Como** administrador de contenido (U2),
> **quiero** subir una foto 360° a una sucursal desde el portal admin,
> **para** tener el espacio disponible en el tour virtual.

**Criterios de aceptación:**
- [ ] Hay una pantalla de galería de espacios por sucursal
- [ ] Se puede subir una foto mediante drag & drop o selector de archivo
- [ ] El sistema valida que la imagen tenga resolución ≥ 4096 × 2048 px
- [ ] Se muestra barra de progreso durante el upload
- [ ] El sistema genera automáticamente un thumbnail WebP 800×400 en background
- [ ] Cuando el thumbnail está listo, la UI se actualiza automáticamente (WebSocket)
- [ ] Archivos que no sean JPEG/PNG son rechazados con mensaje claro

---

## HU-08 — ADMIN: Editar Hotspots sobre la Foto 360°

> **Como** administrador de contenido (U2),
> **quiero** añadir y configurar hotspots sobre la foto 360° de un espacio,
> **para** crear la navegación y los puntos de información del tour.

**Criterios de aceptación:**
- [ ] Existe una pantalla "Editor de Hotspots" que muestra el visor PSV en modo edición
- [ ] Al hacer doble clic en la imagen, se añade un **hotspot de pin** en esa posición (coordenadas Yaw/Pitch)
- [ ] Se abre un modal para configurar: tipo (navegación | información | documento | URL | **área poligonal**), destino
- [ ] Para tipo "navegación": seleccionar espacio destino de un dropdown
- [ ] Para tipo "documento": seleccionar PDF de la biblioteca
- [ ] Para tipo "URL": ingresar URL con validación de formato
- [ ] Para tipo "**área poligonal**": se activa modo polígono — cada clic en la imagen agrega un vértice (mínimo 3); al cerrar el polígono (clic en primer vértice) se abre el modal para asignar un equipo (nombre, tipo, documentos adjuntos)
- [ ] Los vértices del polígono se almacenan como array de coordenadas Yaw/Pitch
- [ ] En el viewer, el área poligonal se renderiza como overlay semitransparente azul que se ilumina al hacer hover
- [ ] Los hotspots guardados se visualizan en el visor del editor
- [ ] Se puede eliminar un hotspot con clic + confirmación

---

## HU-09 — ADMIN: Diseñar la Planimetría de una Sucursal

> **Como** administrador de contenido (U2),
> **quiero** subir el plano de la sucursal y marcar los espacios 360° en él,
> **para** que los visitantes puedan orientarse en el tour.

**Criterios de aceptación:**
- [ ] Existe un editor de planimetría con canvas (React-Konva)
- [ ] Puedo subir una imagen base del plano (PNG o SVG)
- [ ] Puedo añadir marcadores haciendo clic en el canvas
- [ ] Cada marcador se asigna a un espacio 360° de la sucursal
- [ ] Los marcadores son arrastrables para reposicionarlos
- [ ] Puedo guardar la planimetría con un comentario de versión
- [ ] El sistema guarda un historial de versiones; puedo revertir a una versión anterior

---

## HU-10 — ADMIN: Gestionar Documentos de la Biblioteca

> **Como** administrador de contenido (U2),
> **quiero** subir y organizar documentos PDF en la biblioteca de una sucursal,
> **para** que estén disponibles en el viewer para todos los usuarios.

**Criterios de aceptación:**
- [ ] Puedo subir PDFs con nombre, categoría, tags y comentario de versión
- [ ] El sistema guarda un historial de versiones por documento
- [ ] Puedo buscar documentos por nombre, categoría o tag (full-text)
- [ ] Puedo descargar versiones anteriores de un documento
- [ ] Los documentos se pueden asociar a tres niveles: **sucursal**, **espacio 360°** o **hotspot/equipo individual** (relación polimórfica)
- [ ] Al adjuntar un documento a un hotspot de área poligonal, el documento aparece en el panel contextual al hacer clic en esa área desde el viewer

---

## HU-11 — ADMIN: Trabajar sin Conexión y Sincronizar Cambios

> **Como** administrador de contenido (U2),
> **quiero** poder editar datos de infraestructura de una sucursal aunque no tenga internet,
> **para** actualizar información durante visitas a terreno con baja conectividad.

**Criterios de aceptación:**
- [ ] La app muestra un banner visible "Modo Offline" cuando no hay conexión
- [ ] Puedo editar datos de comunicaciones, baterías y torres en modo offline
- [ ] Los cambios se guardan localmente con indicador visual "pendiente de sincronización"
- [ ] Al recuperar la conexión, los cambios se sincronizan automáticamente
- [ ] Se muestra un toast "Cambios sincronizados correctamente" al completar
- [ ] Si un cambio falla la sincronización, se registra el error y se permite reintento manual

---

## HU-12 — ADMIN: Gestionar Usuarios y Roles

> **Como** super administrador (U3),
> **quiero** crear y administrar los usuarios del portal admin y asignarles roles,
> **para** controlar quién puede acceder y qué puede modificar.

**Criterios de aceptación:**
- [ ] Puedo crear usuarios con nombre, email y rol (Admin, Editor, Viewer)
- [ ] Puedo desactivar usuarios sin eliminarlos
- [ ] Existe un log de auditoría que registra quién hizo qué y cuándo, incluyendo logins y valor anterior/nuevo en cambios
- [ ] Los passwords se almacenan con bcrypt (sin texto plano)
- [ ] El login tiene rate limiting: máx 10 intentos/min por IP (protección fuerza bruta)
- [ ] Los passwords deben cumplir política mínima: 8 caracteres, al menos 1 número y 1 símbolo
- [ ] El Super Admin puede asignar a un usuario el **alcance geográfico**: vincularlo a una o más sucursales específicas; el usuario con scope restringido solo verá y podrá editar esas sucursales
- [ ] Un usuario con rol Editor sin sucursales asignadas no puede acceder a ninguna sucursal

---

## HU-13 — ADMIN: Configurar el Branding de la Instancia

> **Como** super administrador (U3),
> **quiero** configurar el nombre de la empresa, logo y colores en el setup wizard,
> **para** que la plataforma refleje la identidad visual del cliente.

**Criterios de aceptación:**
- [ ] Al primer arranque, se muestra el Setup Wizard (pantalla única, no repetible)
- [ ] Puedo subir el logo de la empresa (PNG/SVG, max 2 MB)
- [ ] Puedo definir el color primario de la interfaz
- [ ] Puedo configurar la zona horaria del sistema
- [ ] Los cambios de configuración quedan guardados en `INSTANCIA_CONFIG`
- [ ] El nombre de la empresa se muestra en la barra de navegación del viewer y admin

---

## HU-14 — OPS: Instalar la Plataforma en un Servidor Nuevo

> **Como** técnico de instalación (U3),
> **quiero** instalar la plataforma en un servidor Linux nuevo con un solo comando,
> **para** reducir el tiempo de instalación y evitar errores manuales.

**Criterios de aceptación:**
- [ ] El comando `curl -fsSL https://url-instalacion | bash` inicia el proceso
- [ ] El script verifica que Docker y Docker Compose estén instalados
- [ ] El wizard solicita: dominio, nombre empresa, contraseña admin inicial
- [ ] El SSL se configura automáticamente con Let's Encrypt
- [ ] El proceso completo toma < 30 minutos en un servidor con internet estable
- [ ] Al finalizar, el sistema está operativo y accesible en HTTPS

---

## HU-15 — OPS: Migrar Fotos 360° Existentes

> **Como** técnico de instalación (U3),
> **quiero** migrar las fotos 360° del sistema anterior a MinIO con un script,
> **para** que todo el contenido histórico esté disponible en la nueva plataforma.

**Criterios de aceptación:**
- [ ] El script `migrate-photos.js` incluye modo `--dry-run` que lista qué se migraría sin migrar
- [ ] El script valida dimensiones de cada foto (reporta las que no cumplen ≥ 4096×2048)
- [ ] Las fotos se suben al bucket `spaces/raw/` en MinIO
- [ ] El script genera un log de resumen: fotos migradas, fotos saltadas, errores
- [ ] Las fotos migradas se asocian automáticamente a la sucursal correcta en la base de datos

---

## HU-16 — VIEWER: Registrar Reporte de Inspección / Falla en Sitio

> **Como** técnico de campo (U1),
> **quiero** registrar un reporte de falla o inspección directamente desde el viewer mientras estoy en terreno,
> **para** dejar constancia del problema o hallazgo con fotos y datos estructurados, aunque no tenga internet.

**Criterios de aceptación:**
- [ ] El menú contextual del viewer incluye el ítem **REPORTAR**
- [ ] Al seleccionarlo, se abre el Formulario de Reporte con campos: tipo (Falla / Inspección Preventiva / Revisión), criticidad (Alta / Media / Baja), descripción libre, y opción de adjuntar fotos desde la cámara del dispositivo (máx 5 fotos)
- [ ] El formulario funciona completamente offline: al enviar, el reporte se guarda en la cola `outbox_reportes` en IndexedDB
- [ ] La UI muestra el estado "En cola — pendiente de sincronización" con indicador visual (badge naranja)
- [ ] El Service Worker sincroniza la cola automáticamente cuando se detecta conexión, **aunque la app haya sido cerrada y reabierta** (Background Sync API)
- [ ] Al sincronizar exitosamente, el estado cambia a "Enviado ✓" y aparece un toast de confirmación
- [ ] El técnico puede ver el historial de sus reportes pendientes y sincronizados en la sesión actual
- [ ] En el portal admin (A-17), el nuevo reporte aparece con el badge "Nuevo" hasta que un administrador lo abra
- [ ] El administrador puede cambiar el estado del reporte a "Pendiente de revisión" o "Revisado"

---

## Mapa de Historias por Interfaz

| Interfaz | HU relacionadas |
|----------|----------------|
| V-01 Lista Sucursales | HU-01 |
| V-02 Visor 360° + Menú | HU-01, HU-05, HU-06 |
| V-03 Panel Comunicaciones | HU-02 |
| V-04/05 Paneles Batería/Torre | HU-03 |
| V-06 Panel Informes/Biblioteca | HU-04 |
| V-07 Panel Información | HU-01 |
| **V-08 Formulario Reporte en Campo** | **HU-16** |
| A-05/06 Galería + Upload 360° | HU-07 |
| A-07/08 Editor Hotspots | HU-08 |
| A-09/10 Editor Planimetría | HU-09 |
| A-14/15/16 Biblioteca Documentos | HU-10 |
| A-11/12/13 CRUD Infraestructura | HU-03, HU-11 |
| A-17 Gestión Inspecciones/Informes | **HU-16** |
| A-18/19 Gestión Usuarios | HU-12 |
| A-21/24 Config Instancia / Wizard | HU-13, HU-14 |
| Scripts install.sh + migrate.js | HU-14, HU-15 |