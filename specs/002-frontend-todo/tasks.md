---

description: "Task list template for feature implementation"

---

# Tasks: Frontend Web ToDo

**Input**: Design documents from `/specs/002-frontend-todo/`

**Prerequisites**: plan.md, spec.md, research.md, contracts/ui-api.md, quickstart.md

**Tests**: Se incluyen tareas de prueba de lógica (api client + render) porque la constitución
exige Test-First (NON-NEGOTIABLE) y así fue decidido en la spec.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/` (html/css/js), `frontend/tests/` (vitest) — según plan.md
- Los módulos compartidos `frontend/js/api.js` y `frontend/js/render.js` son usados por varios user
  stories; sus tareas DEBEN ejecutarse en orden (no marcadas `[P]`). La independencia por user story
  se garantiza por prioridad secuencial.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialización de la estructura del frontend

- [x] T001 [P] Create estructura de carpetas `frontend/` (`css/`, `js/`, `tests/`) en la raíz del repo
- [x] T002 [P] Verificar que `vitest` está disponible (ya instalado en el repo) para `frontend/tests`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura base que debe completarse antes de cualquier user story

**CRITICAL**: No puede comenzar ningún user story hasta completar esta fase

- [x] T003 Create `frontend/index.html` (estructura: listado de tareas, formulario de creación, contenedores de estados)
- [x] T004 Create `frontend/css/styles.css` (estilos responsive básicos del listado y formulario)
- [x] T005 Create cliente HTTP `frontend/js/api.js` (funciones `listTasks`, `createTask`, `updateTask`, `deleteTask` con fetch)
- [x] T006 Create funciones de render `frontend/js/render.js` (render de listado, estado vacío, mensajes de error)
- [x] T007 Create orquestador `frontend/js/app.js` (carga inicial y listeners de eventos)

**Checkpoint**: Fundación lista; los user stories pueden comenzar

---

## Phase 3: User Story 1 - Ver el listado de tareas (Priority: P1) MVP

**Goal**: El usuario ve todas las tareas con su estado (FR-001, FR-006)

**Independent Test**: Con la API corriendo, abrir el frontend y ver el listado; verificar estados vacío y de error.

### Tests for User Story 1

> **NOTA: Escribir la prueba PRIMERO y verificar que FALLE antes de implementar (Red)**

- [x] T008 [US1] Escribir prueba de `listTasks()` en `frontend/tests/api.test.js` (fetch mockeado: éxito con array, lista vacía, error de red) y verificar que falla
- [x] T009 [US1] Escribir prueba de render del listado/estados en `frontend/tests/render.test.js` (lista con tareas, estado vacío, estado error) y verificar que falla

### Implementation for User Story 1

- [x] T010 [US1] Implementar `listTasks()` en `frontend/js/api.js` (GET /api/tasks, manejar no-2xx y errores de red)
- [x] T011 [US1] Implementar funciones de render de listado/vacío/error en `frontend/js/render.js`
- [x] T012 [US1] Integrar carga inicial en `frontend/js/app.js` (llamar listTasks al cargar y pintar)
- [x] T013 [US1] Ejecutar `npx vitest run frontend/tests` y verificar que las pruebas de US1 pasan (Green)

**Checkpoint**: User Story 1 funcional y testeable de forma independiente (MVP)

---

## Phase 4: User Story 2 - Crear una tarea (Priority: P1)

**Goal**: El usuario crea una tarea con título obligatorio y descripción opcional (FR-002, FR-005, FR-007)

**Independent Test**: Crear una tarea desde el formulario y verificar que aparece en el listado sin recargar.

### Tests for User Story 2

- [x] T014 [US2] Escribir prueba de `createTask()` en `frontend/tests/api.test.js` (201 al crear, error 400 por título vacío) y verificar que falla

### Implementation for User Story 2

- [x] T015 [US2] Implementar `createTask()` en `frontend/js/api.js` (POST /api/tasks)
- [x] T016 [US2] Implementar validación de título no vacío y envío del formulario en `frontend/js/app.js`
- [x] T017 [US2] Recargar el listado tras crear y mostrar errores en `frontend/js/app.js`
- [x] T018 [US2] Ejecutar `npx vitest run frontend/tests` y verificar que las pruebas de US2 pasan (Green)

**Checkpoint**: User Stories 1 y 2 funcionales (MVP completo)

---

## Phase 5: User Story 3 - Actualizar tarea (estado y texto) (Priority: P2)

**Goal**: El usuario alterna el estado y edita título/descripción (FR-003, FR-007)

**Independent Test**: Marcar una tarea completada y editar su texto; verificar que el listado refleja los cambios.

### Tests for User Story 3

- [x] T019 [US3] Escribir prueba de `updateTask()` en `frontend/tests/api.test.js` (200 al actualizar estado/texto, 404 id inexistente) y verificar que falla

### Implementation for User Story 3

- [x] T020 [US3] Implementar `updateTask()` en `frontend/js/api.js` (PATCH /api/tasks/:id)
- [x] T021 [US3] Implementar alternar estado (checkbox/control) en `frontend/js/app.js`
- [x] T022 [US3] Implementar edición de título/descripción y guardado en `frontend/js/app.js`
- [x] T023 [US3] Ejecutar `npx vitest run frontend/tests` y verificar que las pruebas de US3 pasan (Green)

**Checkpoint**: User Stories 1-3 funcionales

---

## Phase 6: User Story 4 - Eliminar una tarea (Priority: P3)

**Goal**: El usuario elimina una tarea con confirmación previa (FR-004, FR-007)

**Independent Test**: Eliminar una tarea (con confirmación) y verificar que desaparece del listado.

### Tests for User Story 4

- [x] T024 [US4] Escribir prueba de `deleteTask()` en `frontend/tests/api.test.js` (204 al eliminar, 404 id inexistente) y verificar que falla

### Implementation for User Story 4

- [x] T025 [US4] Implementar `deleteTask()` en `frontend/js/api.js` (DELETE /api/tasks/:id)
- [x] T026 [US4] Implementar botón de eliminar con confirmación y actualización del listado en `frontend/js/app.js`
- [x] T027 [US4] Ejecutar `npx vitest run frontend/tests` y verificar que las pruebas de US4 pasan (Green)

**Checkpoint**: Todos los user stories funcionales

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Mejoras que afectan a varios user stories

- [x] T028 [P] Ejecutar los escenarios de `quickstart.md` manualmente (con backend + `npx serve frontend`)
- [x] T029 Actualizar `README.md` con instrucciones de uso del frontend y referencia a `specs/002-frontend-todo`

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
- **US3 (P2)**: Puede comenzar tras Foundational (secuencialmente por compartir `api.js`/`app.js`).
- **US4 (P3)**: Puede comenzar tras Foundational (secuencialmente por compartir `api.js`/`app.js`).

### Within Each User Story

- Pruebas escritas PRIMERO y verificadas fallando antes de la implementación (Red-Green-Refactor)
- Implementación de la función de API antes de la integración en `app.js` (Green)

### Parallel Opportunities

- T001 y T002 de Setup pueden correr en paralelo
- T008/T009 (US1) pueden correr en paralelo (archivos de test distintos)
- El resto de fases es secuencial por compartir `api.js`/`app.js`
- T028 y T029 de Polish pueden correr en paralelo

---

## Parallel Example: Phase 3 Tests

```bash
# Lanzar las pruebas de US1 en paralelo (archivos de test distintos):
Task: "T008 Escribir prueba de listTasks() en frontend/tests/api.test.js"
Task: "T009 Escribir prueba de render del listado en frontend/tests/render.test.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2 Only)

1. Completar Phase 1 (Setup)
2. Completar Phase 2 (Foundational)
3. Completar US1 (Ver) y US2 (Crear) — P1
4. **STOP y VALIDAR**: `npx vitest run frontend/tests` + quickstart
5. Demo del MVP (ver + crear)

### Incremental Delivery

1. Setup + Foundational → Fundación lista
2. US1 Ver → test → demo (parte del MVP)
3. US2 Crear → test → demo (MVP completo)
4. US3 Actualizar → test → demo
5. US4 Eliminar → test → demo

---

## Notes

- [P] tasks = archivos diferentes, sin dependencias
- [Story] label mapea la tarea a su user story
- Cada user story es independientemente completable y testeable
- Verificar que las pruebas fallan antes de implementar (TDD)
- Commits tras cada tarea o grupo lógico
- `api.js`/`app.js` compartidos por varios stories → ejecución secuencial ahí