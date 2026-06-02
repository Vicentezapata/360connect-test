# Implementation Plan — Virtual Tour Platform

> **Skill aplicada:** create-implementation-plan
> **Epic:** Virtual Tour Platform — Tour Virtual 360° con Portal de Administración
> **PRD:** `docs/plan/virtual-tour-platform/epic.md`
> **Arquitectura:** `docs/plan/virtual-tour-platform/arch.md`
> **Estado:** ![Status: In Progress](https://img.shields.io/badge/status-in_progress-blue)

Plan de implementación end-to-end de la plataforma de tour virtual de sucursales, con despliegue on-premise en Docker Compose. Cubre desde la infraestructura base hasta QA final, en 6 fases secuenciales.

---

## 1. Requirements & Constraints

- **REQ-001**: Stack on-premise — no depender de servicios cloud de terceros (Supabase, AWS, etc.)
- **REQ-002**: Viewer funcional en Chrome y Firefox (latest-2)
- **REQ-003**: Admin portal PWA con soporte offline real (IndexedDB write queue)
- **REQ-004**: Viewer PWA con soporte offline para sucursales previamente cargadas
- **REQ-005**: 50 usuarios concurrentes sin degradación; 20 sucursales iniciales
- **REQ-006**: Archivos 360° servidos solo mediante presigned URLs con expiración
- **REQ-007**: Menú contextual del viewer con exactamente 8 ítems (COMUNICACIONES, BATERÍAS, TORRE, INFORMES, PLANIMETRÍA, BIBLIOTECA, INFORMACIÓN, SALIDA)
- **REQ-008**: Editor de planimetría en canvas 2D con React-Konva
- **REQ-009**: Editor de hotspots sobre visor 360° con tipos: navegación, información, documento, URL
- **REQ-010**: Versionado de planimetrías (historial + rollback)
- **REQ-011**: Versionado de documentos PDF (historial + rollback)
- **REQ-012**: Audit log completo de todas las acciones de escritura
- **SEC-001**: JWT de 15 min + refresh token rotativo (7 días) en cookie HttpOnly Secure SameSite=Strict
- **SEC-002**: Validación de inputs con Zod en API (no confiar en el cliente)
- **SEC-003**: Upload de archivos: validar tipo MIME + cabecera binaria; max 100 MB por archivo
- **SEC-004**: Rate limiting en endpoints de auth (máx 10 intentos/min por IP)
- **SEC-005**: HTTPS obligatorio; HSTS header habilitado
- **CON-001**: Greenfield — no existe backend; migrar solo fotos 360° desde sistema legado
- **CON-002**: Despliegue único por cliente (quasi-tenancy por instalación, no multi-tenant)
- **CON-003**: Formatos de informe: solo PDF (sin generación dinámica de reportes)
- **GUD-001**: Monorepo con Turborepo — linting y build en paralelo
- **GUD-002**: Prisma para migraciones; nunca ejecutar SQL crudo que altere el esquema
- **GUD-003**: BullMQ para toda tarea de procesamiento lenta (thumbnails, backups); no bloquear el hilo de la API
- **PAT-001**: Presigned URL flow — la API genera la URL, el cliente descarga directo de MinIO
- **PAT-002**: Optimistic UI en admin con rollback en caso de error de sincronización

---

## 2. Implementation Steps

### Phase 0 — Infraestructura Base y Migración de Fotos

- **GOAL-001**: Tener el stack Docker Compose operativo en el servidor del cliente con SSL, y migrar las fotos 360° existentes a MinIO.

| Task | Description | Completada | Fecha |
|------|-------------|-----------|-------|
| TASK-001 | Crear monorepo Turborepo: `apps/web`, `apps/admin`, `apps/api`, `packages/*` | | |
| TASK-002 | Crear `docker-compose.yml` con servicios: nginx, postgres, redis, minio, api | | |
| TASK-003 | Configurar Nginx: proxy reverso, rutas `/`, `/admin`, `/api`, `/minio-ui` | | |
| TASK-004 | Configurar Certbot + Let's Encrypt para SSL automático | | |
| TASK-005 | Configurar MinIO: bucket `spaces` (raw, thumbs) + bucket `documents` + bucket `backups` | | |
| TASK-006 | Crear schema Prisma inicial (todas las tablas del ER) + primera migración | | |
| TASK-007 | Escribir script `scripts/migrate-photos.js` — lee fotos locales, valida, sube a MinIO `spaces/raw/` | | |
| TASK-008 | Ejecutar migración de fotos existentes y verificar en MinIO UI | | |
| TASK-009 | Crear `scripts/install.sh` — setup wizard interactivo (branding, dominio, DB, usuario admin inicial) | | |
| TASK-010 | Configurar GitHub Actions: CI (lint + build) en PR + deploy SSH en push a `main` | | |

### Phase 1 — API Core: Auth, CRUD Sucursales y Usuarios

- **GOAL-002**: API NestJS funcional con autenticación JWT, gestión de usuarios/roles y CRUD completo de sucursales y espacios 360°.

| Task | Description | Completada | Fecha |
|------|-------------|-----------|-------|
| TASK-011 | Módulo `auth`: registro, login, refresh token, logout (blacklist en Redis) | | |
| TASK-012 | Guards JWT + decoradores `@Roles()`, `@Permissions()` para RBAC | | |
| TASK-013 | Módulo `users`: CRUD usuarios, asignación de roles, reset de contraseña | | |
| TASK-014 | Módulo `branches`: CRUD sucursales, activar/desactivar, filtros por región/ciudad | | |
| TASK-015 | Módulo `spaces`: CRUD espacios 360°, reordenamiento (campo `orden`), presigned URL GET | | |
| TASK-016 | Módulo `uploads`: recibir multipart, validar MIME + dimensiones (4096×2048), subir a MinIO | | |
| TASK-017 | BullMQ Worker `ThumbnailProcessor`: sharp.js → WebP 800×400, sube a MinIO thumbs/ | | |
| TASK-018 | WebSocket gateway: emitir evento `PHOTO_READY` al admin cuando thumbnail esté listo | | |
| TASK-019 | Módulo `infrastructure`: CRUD comunicaciones, baterías, torres por sucursal | | |
| TASK-020 | Módulo `audit`: interceptor global que registra todas las mutaciones en `AUDIT_LOG` | | |
| TASK-021 | Módulo `config-instance`: leer/escribir `INSTANCIA_CONFIG` (branding, timezone, etc.) | | |
| TASK-022 | Health check endpoint `GET /health` con estado de DB, Redis y MinIO | | |
| TASK-023 | Tests unitarios de auth (JWT, guards) + tests de integración de branches y spaces | | |

### Phase 2 — Viewer Público 360°

- **GOAL-003**: Aplicación viewer completamente funcional con tour 360°, menú contextual de 8 ítems, paneles de infraestructura y soporte offline PWA.

| Task | Description | Completada | Fecha |
|------|-------------|-----------|-------|
| TASK-024 | Scaffolding `apps/web` con Vite 6 + React 19 + TypeScript + Tailwind v4 | | |
| TASK-025 | Pantalla V-01: Lista de sucursales con portada thumbnail, filtros región/ciudad | | |
| TASK-026 | Integración `@photo-sphere-viewer/core` con plugins: virtual-tour, markers, map, gallery | | |
| TASK-027 | Pantalla V-02: Visor 360° fullscreen con mini-mapa overlay de planimetría | | |
| TASK-028 | Implementar menú contextual de 8 ítems superpuesto en el visor (animación slide-in) | | |
| TASK-029 | Panel V-03 Comunicaciones: fetch datos + tabla + descarga PDF adjunto | | |
| TASK-030 | Panel V-04 Baterías + Panel V-05 Torre: fetch datos + display técnico | | |
| TASK-031 | Panel V-06 Informes/Biblioteca: lista de PDFs con descarga mediante presigned URL | | |
| TASK-032 | Panel V-07 Información: datos generales de la sucursal | | |
| TASK-033 | Navegación entre espacios 360° mediante hotspots tipo `navegacion` | | |
| TASK-034 | Hotspot tipo `informacion`: tooltip/modal con texto enriquecido | | |
| TASK-035 | Hotspot tipo `documento`: abre PDF en nueva pestaña vía presigned URL | | |
| TASK-036 | Hotspot tipo `url_externo`: abre URL en nueva pestaña con confirmación | | |
| TASK-037 | Configurar `vite-plugin-pwa` + Workbox para cache offline del viewer | | |
| TASK-038 | Service Worker: pre-cachear thumbnails + datos de sucursales visitadas | | |
| TASK-039 | Lighthouse performance: lazy loading, image optimization, bundle splitting < 200 KB inicial | | |

### Phase 3 — Portal Admin: Editor de Planimetría, Hotspots y Documentos

- **GOAL-004**: Portal admin completo con gestión de contenido, editor de planimetría en canvas, editor de hotspots, biblioteca de documentos y soporte offline PWA.

| Task | Description | Completada | Fecha |
|------|-------------|-----------|-------|
| TASK-040 | Scaffolding `apps/admin` con Vite 6 + React 19 + TypeScript + shadcn/ui + Tailwind v4 | | |
| TASK-041 | Pantalla A-01 Login con React Hook Form + Zod + manejo de JWT + refresh automático | | |
| TASK-042 | Pantalla A-02 Dashboard: KPIs desde API, actividad reciente, alertas | | |
| TASK-043 | Pantalla A-03 Lista de Sucursales + A-04 Crear/Editar Sucursal | | |
| TASK-044 | Pantalla A-05 Galería de Espacios: grid, drag & drop para reordenar, estado de procesamiento | | |
| TASK-045 | Pantalla A-06 Upload Foto 360°: drag & drop, progreso en tiempo real, preview thumbnail | | |
| TASK-046 | Pantalla A-07 Editor de Hotspots: PSV en modo edición, doble clic añade hotspot | | |
| TASK-047 | Pantalla A-08 Modal Configurar Hotspot: tipo (enum), destino dinámico según tipo | | |
| TASK-048 | API: módulo `hotspots` CRUD completo + validación de payload por tipo | | |
| TASK-049 | Pantalla A-09 Editor de Planimetría: React-Konva stage, carga imagen base, marcadores | | |
| TASK-050 | React-Konva: arrastrar marcadores, seleccionar, editar, eliminar. Guardado como JSON en DB | | |
| TASK-051 | Pantalla A-10 Historial de Planimetrías: lista de versiones, diff visual, rollback | | |
| TASK-052 | API: módulo `floor-plans` con versionado automático en cada `PUT` | | |
| TASK-053 | Pantallas A-11/12/13: CRUD Comunicaciones, Baterías, Torres | | |
| TASK-054 | Pantalla A-14 Biblioteca: lista con búsqueda full-text (PostgreSQL `tsvector`) + filtros | | |
| TASK-055 | Pantalla A-15 Upload Documento + A-16 Historial Versiones | | |
| TASK-056 | API: módulo `documents` con versioning automático en cada upload | | |
| TASK-057 | Pantalla A-17 Informes: upload PDFs por sucursal | | |
| TASK-058 | Pantallas A-18/19: CRUD Usuarios + asignación de roles | | |
| TASK-059 | Pantalla A-20 Audit Log: tabla paginada con filtros | | |
| TASK-060 | Pantalla A-21 Configuración Instancia: logo upload a MinIO, colores, timezone | | |
| TASK-061 | Pantalla A-22 Notificaciones + A-23 Perfil de Usuario | | |
| TASK-062 | Pantalla A-24 Setup Wizard: only-once wizard al primer arranque | | |
| TASK-063 | Configurar PWA offline para admin: `vite-plugin-pwa` + Workbox | | |
| TASK-064 | IndexedDB write queue con `idb-keyval`: cola de operaciones offline pendientes | | |
| TASK-065 | Service Worker: detectar `navigator.onLine`, procesar cola al reconectar | | |
| TASK-066 | UI offline: banner de estado de conexión, indicadores de cambios pendientes | | |

### Phase 4 — Operaciones, Seguridad y Hardening

- **GOAL-005**: Sistema de producción hardened con backup automatizado, monitoreo, rate limiting y auditoría de seguridad OWASP.

| Task | Description | Completada | Fecha |
|------|-------------|-----------|-------|
| TASK-067 | BullMQ Worker `BackupProcessor`: pg_dump diario → MinIO bucket `backups/` | | |
| TASK-068 | BullMQ Worker `BackupCleanup`: retener últimos 30 días, eliminar anteriores | | |
| TASK-069 | Nginx: configurar HSTS, X-Content-Type-Options, CSP, X-Frame-Options headers | | |
| TASK-070 | Rate limiting con `@nestjs/throttler`: 10 req/min en auth, 100 req/min general | | |
| TASK-071 | Configurar Winston: logs rotados en `/logs/` con retención 30 días | | |
| TASK-072 | Endpoint `GET /health` completo con uptime, versión, estado de dependencias | | |
| TASK-073 | Variables de entorno: `.env.example` documentado + validación de vars requeridas al arranque | | |
| TASK-074 | Revisar y aplicar OWASP Top 10: inyección, broken auth, exposure, XXE, IDOR, SSRF | | |
| TASK-075 | Documentar `docker-compose.prod.yml` con resource limits (CPU/RAM por servicio) | | |
| TASK-076 | Probar script `scripts/install.sh` en VM limpia (Ubuntu 22.04) end-to-end | | |

### Phase 5 — QA, Testing E2E y Launch

- **GOAL-006**: Suite de tests completa, Lighthouse score ≥ 90, checklist de lanzamiento completada.

| Task | Description | Completada | Fecha |
|------|-------------|-----------|-------|
| TASK-077 | Configurar Playwright para tests E2E: Chrome + Firefox | | |
| TASK-078 | Tests E2E viewer: listado sucursales, abrir tour, navegar hotspots, abrir 3 paneles | | |
| TASK-079 | Tests E2E admin: login, upload foto 360°, crear hotspot, guardar planimetría, upload documento | | |
| TASK-080 | Tests E2E offline: simular desconexión en admin, editar, reconectar, verificar sincronización | | |
| TASK-081 | Tests unitarios API: auth guards, DTOs Zod, módulos infrastructure y documents | | |
| TASK-082 | Prueba de carga: simular 50 usuarios concurrentes en viewer con k6 | | |
| TASK-083 | Lighthouse audit viewer: Performance ≥ 90, Accessibility ≥ 90, Best Practices ≥ 90 | | |
| TASK-084 | Revisar presigned URL security: verificar que MinIO no permite acceso sin URL firmada | | |
| TASK-085 | Documentación técnica: README monorepo, guía de instalación, guía de administración | | |
| TASK-086 | Crear `CHANGELOG.md` con versión 1.0.0 | | |
| TASK-087 | Demo con cliente: recorrido completo de viewer + demo de todas las pantallas admin | | |
| TASK-088 | Deploy a producción en servidor del cliente + validación final | | |

---

## 3. Alternativas Consideradas

- **ALT-001**: Supabase como backend-as-a-service — descartado porque el cliente requiere on-premise total sin dependencia de servicios cloud
- **ALT-002**: Next.js App Router en lugar de Vite + React Router — descartado porque el proyecto es SPA sin SSR y Vite es más simple de desplegar en Nginx
- **ALT-003**: Three.js para el canvas de planimetría — descartado porque React-Konva es más simple para shapes 2D + integración declarativa con React
- **ALT-004**: AWS S3 para almacenamiento — descartado; MinIO da la misma API S3 completamente on-premise
- **ALT-005**: tRPC en lugar de REST — descartado porque el cliente puede necesitar consumir la API desde herramientas externas en el futuro; REST es más universalmente compatible

---

## 4. Dependencias

- **DEP-001**: Node.js 22 LTS en servidor de CI/CD (GitHub Actions runner)
- **DEP-002**: Docker 27+ y Docker Compose v2 en el servidor del cliente
- **DEP-003**: Dominio DNS apuntando al servidor (para Let's Encrypt)
- **DEP-004**: Puerto 80/443 abierto en el firewall del servidor del cliente
- **DEP-005**: Fotos 360° existentes accesibles en ruta local para la migración (Phase 0)
- **DEP-006**: Licencia comercial confirmada para `@photo-sphere-viewer` (PSV es open-source MIT)

---

## 5. Archivos Principales del Proyecto

- **FILE-001**: `docker-compose.yml` — Stack completo de producción
- **FILE-002**: `apps/api/prisma/schema.prisma` — Esquema central de la DB
- **FILE-003**: `apps/web/src/components/viewer/Viewer360.tsx` — Componente PSV principal
- **FILE-004**: `apps/admin/src/components/floor-plan/FloorPlanEditor.tsx` — Editor canvas React-Konva
- **FILE-005**: `apps/admin/src/components/hotspot/HotspotEditor.tsx` — Editor hotspots sobre PSV
- **FILE-006**: `apps/admin/src/sw/offline-queue.ts` — Cola IndexedDB offline
- **FILE-007**: `apps/api/src/jobs/thumbnail.processor.ts` — BullMQ processor de thumbnails
- **FILE-008**: `scripts/install.sh` — Setup wizard de instalación
- **FILE-009**: `scripts/migrate-photos.js` — Migración fotos → MinIO
- **FILE-010**: `.github/workflows/deploy.yml` — Pipeline CI/CD

---

## 6. Testing

- **TEST-001**: E2E Playwright — flujo completo viewer (Chrome + Firefox): listado → tour → 3 paneles → descarga PDF
- **TEST-002**: E2E Playwright — flujo upload foto 360°: drag & drop → progreso → WebSocket PHOTO_READY
- **TEST-003**: E2E Playwright — flujo editor planimetría: subir plano → colocar marcadores → guardar → historial
- **TEST-004**: E2E Playwright — flujo offline admin: desconectar → editar → reconectar → verificar sincronización
- **TEST-005**: Tests unitarios API — auth: login, token expirado, refresh, logout, brute force
- **TEST-006**: Tests de integración — CRUD branches + spaces + hotspots
- **TEST-007**: Prueba de carga k6 — 50 usuarios concurrentes en viewer
- **TEST-008**: Lighthouse — Performance ≥ 90 en viewer (mobile + desktop)
- **TEST-009**: Security — verificar que files de MinIO son inaccesibles sin presigned URL

---

## 7. Risks & Assumptions

- **RISK-001**: Las fotos 360° existentes pueden no cumplir la resolución mínima requerida (4096×2048) — Mitigación: script de migración con modo `--dry-run` que reporta cuáles fotos no cumplen antes de migrar
- **RISK-002**: Performance del canvas React-Konva con planos de alta resolución en dispositivos de gama media — Mitigación: limitar resolución de imagen base del plano a max 4096px, usar `pixelRatio` adaptativo
- **RISK-003**: Sincronización offline puede tener conflictos si dos admins editan la misma sucursal sin conexión — Mitigación: last-write-wins para v1; registrar conflicto en audit log
- **RISK-004**: Let's Encrypt requiere que el dominio resuelva al servidor para la validación HTTP-01 — Mitigación: documentar en `install.sh` que el DNS debe estar propagado antes de ejecutar el wizard
- **RISK-005**: El servidor del cliente puede tener menos de 16 GB RAM — Mitigación: `docker-compose.yml` con resource limits conservadores; documentar requisitos mínimos de 8 GB
- **ASS-001**: El equipo tiene experiencia previa con React y Node.js
- **ASS-002**: Los usuarios del viewer son internos de la organización; no es necesaria autenticación en el viewer público en v1
- **ASS-003**: Las fotos 360° a migrar están en formato JPEG/PNG equirectangular (2:1 ratio)