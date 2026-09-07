---

description: "Task list template for feature implementation"

---

# Tasks: Todo List CRUD

**Input**: Design documents from `/specs/001-todo-crud/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md, quickstart.md

**Tests**: Se incluyen tareas de prueba porque la constitución exige Test-First (NON-NEGOTIABLE).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root (según plan.md)
- Nota: los handlers de todos los user stories viven en `src/tasks.js` y las pruebas en
  `tests/tasks.test.js`, por lo que las tareas sobre esos dos archivos DEBEN ejecutarse en orden
  (no marcadas `[P]`). La independencia por user story se garantiza por prioridad secuencial.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialización del proyecto y estructura básica

- [x] T001 [P] Create `package.json` y estructura de carpetas (`src/`, `tests/`, `data/`) en la raíz del repo
- [x] T002 [P] Instalar dependencias de runtime: `express`, `cors`, `morgan` (SQLite v�a `node:sqlite`) en `package.json`
- [x] T003 [P] Instalar dependencias de desarrollo: `vitest`, `supertest`; agregar scripts `start`, `dev` y `test` en `package.json`
- [x] T004 [P] Create `.gitignore` en la raíz del repo (node_modules/, data/, *.db, *.log, .env*)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura base que debe completarse antes de cualquier user story

**CRITICAL**: No puede comenzar ningún user story hasta completar esta fase

- [x] T005 Create módulo de base de datos `src/db.js` (conexión better-sqlite3 + esquema tabla `tasks` con CHECK en status)
- [x] T006 Create aplicación Express `src/app.js` (middleware json/cors/morgan, montar router `/api/tasks`, manejador de errores)
- [x] T007 Create router `src/tasks.js` con handlers vacíos para POST/GET/PATCH/DELETE
- [x] T008 Create punto de entrada `src/server.js` (levanta el servidor en `PORT`, default 3000)
- [x] T009 Create helper de test `tests/helpers.js` (app factory con base SQLite en memoria para supertest)

**Checkpoint**: Fundación lista; los user stories pueden comenzar

---

## Phase 3: User Story 1 - Crear una tarea (Priority: P1) MVP

**Goal**: El usuario puede crear una tarea con título obligatorio y descripción opcional (FR-001, FR-005)

**Independent Test**: Crear una tarea y verificar `201` con `status: "pendiente"`; título vacío devuelve `400`.

### Tests for User Story 1

> **NOTA: Escribir la prueba PRIMERO y verificar que FALLE antes de implementar (Red)**

- [x] T010 [US1] Escribir test de integración para `POST /api/tasks` en `tests/tasks.test.js` (201 al crear, 400 con título vacío) y verificar que falla

### Implementation for User Story 1

- [x] T011 [US1] Implementar handler `POST /api/tasks` en `src/tasks.js` (validar title, insertar, devolver 201 con recurso)
- [x] T012 [US1] Ejecutar `npm test` y verificar que el test de POST pasa (Green)

**Checkpoint**: User Story 1 funcional y testeable de forma independiente

---

## Phase 4: User Story 2 - Listar tareas (Priority: P1)

**Goal**: El usuario puede consultar todas las tareas con su estado y fechas (FR-002)

**Independent Test**: Crear varias tareas y verificar que `GET /api/tasks` devuelve `200` con todas.

### Tests for User Story 2

- [x] T013 [US2] Escribir test de integración para `GET /api/tasks` en `tests/tasks.test.js` (200 con lista, 200 con lista vacía) y verificar que falla

### Implementation for User Story 2

- [x] T014 [US2] Implementar handler `GET /api/tasks` en `src/tasks.js` (seleccionar todas, devolver 200 array)
- [x] T015 [US2] Ejecutar `npm test` y verificar que el test de GET pasa (Green)

**Checkpoint**: User Stories 1 y 2 funcionales

---

## Phase 5: User Story 3 - Actualizar una tarea (Priority: P2)

**Goal**: El usuario puede actualizar parcialmente título, descripción y/o estado (FR-003, FR-006, FR-007)

**Independent Test**: Crear una tarea, marcarla completada vía PATCH y verificar el cambio; status inválido `400`; id inexistente `404`.

### Tests for User Story 3

- [x] T016 [US3] Escribir test de integración para `PATCH /api/tasks/:id` en `tests/tasks.test.js` (200 al actualizar, 400 status inválido, 404 id inexistente) y verificar que falla

### Implementation for User Story 3

- [x] T017 [US3] Implementar handler `PATCH /api/tasks/:id` en `src/tasks.js` (actualización parcial, validación status, 404)
- [x] T018 [US3] Ejecutar `npm test` y verificar que el test de PATCH pasa (Green)

**Checkpoint**: User Stories 1-3 funcionales

---

## Phase 6: User Story 4 - Eliminar una tarea (Priority: P3)

**Goal**: El usuario puede eliminar una tarea existente (FR-004, FR-007)

**Independent Test**: Crear y eliminar una tarea; verificar `204` y que desaparece del listado; id inexistente `404`.

### Tests for User Story 4

- [x] T019 [US4] Escribir test de integración para `DELETE /api/tasks/:id` en `tests/tasks.test.js` (204 al eliminar, 404 id inexistente) y verificar que falla

### Implementation for User Story 4

- [x] T020 [US4] Implementar handler `DELETE /api/tasks/:id` en `src/tasks.js` (eliminar, 204, 404)
- [x] T021 [US4] Ejecutar `npm test` y verificar que el test de DELETE pasa (Green)

**Checkpoint**: Todos los user stories funcionales

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Mejoras que afectan a varios user stories

- [x] T022 [P] Ejecutar los escenarios de validación de `quickstart.md` manualmente contra el servidor
- [x] T023 Actualizar `README.md` con instrucciones de instalación, uso de la API y referencia al contrato

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias
- **Foundational (Phase 2)**: Depende de Setup — BLOQUEA todos los user stories
- **User Stories (Phase 3-6)**: Dependen de Foundational; se ejecutan en orden de prioridad (P1 → P2 → P3)
- **Polish (Phase 7)**: Depende de todos los user stories completos

### User Story Dependencies

- **US1 (P1)**: Puede comenzar tras Foundational. Sin dependencias de otros stories.
- **US2 (P1)**: Puede comenzar tras Foundational. Independiente de US1.
- **US3 (P2)**: Puede comenzar tras Foundational (secuencialmente tras US1/US2 por compartir `src/tasks.js`).
- **US4 (P3)**: Puede comenzar tras Foundational (secuencialmente por compartir `src/tasks.js`).

### Within Each User Story

- Pruebas escritas PRIMERO y verificadas fallando antes de la implementación (Red-Green-Refactor)
- Implementación del handler antes de la verificación (Green)

### Parallel Opportunities

- Las tareas de Setup marcadas `[P]` (T001-T004) pueden correr en paralelo
- Los pasos Red/Green de cada user story son secuenciales por compartir `tests/tasks.test.js` y `src/tasks.js`
- T022 y T023 de Polish pueden correr en paralelo

---

## Parallel Example: Phase 1 Setup

```bash
# Lanzar tareas de Setup en paralelo (archivos diferentes):
Task: "T001 Create package.json y estructura de carpetas en la raíz del repo"
Task: "T004 Create .gitignore en la raíz del repo"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2 Only)

1. Completar Phase 1 (Setup)
2. Completar Phase 2 (Foundational)
3. Completar US1 (Crear) y US2 (Listar) — P1
4. **STOP y VALIDAR**: `npm test` y quickstart
5. Demo del MVP (crear + listar)

### Incremental Delivery

1. Setup + Foundational → Fundación lista
2. US1 Crear → test → demo (parte del MVP)
3. US2 Listar → test → demo (MVP completo)
4. US3 Actualizar → test → demo
5. US4 Eliminar → test → demo

---

## Notes

- [P] tasks = archivos diferentes, sin dependencias
- [Story] label mapea la tarea a su user story
- Cada user story es independientemente completable y testeable
- Verificar que las pruebas fallan antes de implementar (TDD)
- Commits tras cada tarea o grupo lógico
- Los handlers y tests comparten archivo (`src/tasks.js`, `tests/tasks.test.js`) → ejecución secuencial ahí