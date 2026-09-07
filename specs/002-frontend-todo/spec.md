# Feature Specification: Frontend Web ToDo

**Feature Branch**: `002-frontend-todo`

**Created**: 2026-09-06

**Status**: Draft

**Input**: User description: "Frontend web Vanilla JS para la lista ToDo: ver tareas, crear, marcar completada, eliminar; consume la API REST /api/tasks existente."

## Clarifications

### Session 2026-09-06

- Q: ¿Cómo se sirve el frontend Vanilla JS para que consuma la API? → A: Servidor estático aparte (npx serve) que consume la API en http://localhost:3000.
- Q: Además de alternar el estado, ¿el frontend debe permitir editar el título y la descripción? → A: Sí, editar texto también (PATCH completo).
- Q: ¿Qué nivel de pruebas se usa para el frontend? → A: Vitest con pruebas de lógica (api client, render).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver el listado de tareas (Priority: P1)

Como **usuario** necesito **ver todas mis tareas con su título, descripción y estado al abrir la
aplicación** para **saber qué tengo pendiente de forma inmediata**.

**Why this priority**: Sin poder ver las tareas no hay utilidad; es la base del producto junto con la
creación.

**Independent Test**: Se puede validar de forma autónoma abriendo la pantalla y comprobando que las
tareas existentes en la API se muestran con su estado.

**Acceptance Scenarios**:

1. **Given** que la API tiene varias tareas, **When** el usuario abre la pantalla, **Then** se muestran todas con título, descripción y estado.
2. **Given** que la API no tiene tareas, **When** el usuario abre la pantalla, **Then** se muestra un mensaje de lista vacía (sin errores).
3. **Given** que la API está inaccesible, **When** el usuario abre la pantalla, **Then** se muestra un mensaje de error claro en lugar de quedarse cargando.

---

### User Story 2 - Crear una tarea (Priority: P1)

Como **usuario** necesito **crear una tarea ingresando un título (obligatorio) y una descripción
opcional** para **registrar y no olvidar lo que debo hacer**.

**Why this priority**: Crear es la segunda mitad del MVP; junto con ver forma un producto usable.

**Independent Test**: Se puede validar de forma autónoma creando una tarea desde el formulario y
comprobando que aparece en el listado con estado "pendiente".

**Acceptance Scenarios**:

1. **Given** un formulario de creación, **When** el usuario ingresa un título y envía, **Then** la tarea se crea y aparece en el listado con estado "pendiente".
2. **Given** que el usuario envía con el título vacío, **When** intenta crear, **Then** se muestra un mensaje de validación y no se envía la petición.
3. **Given** que la creación falla por un error de la API, **When** el usuario envía, **Then** se muestra un mensaje de error y la pantalla no queda en estado inconsistente.

---

### User Story 3 - Actualizar una tarea (estado y texto) (Priority: P2)

Como **usuario** necesito **marcar una tarea como completada (o revertirla a pendiente) y editar su
título o descripción** para **reflejar su avance real y corregir su información**.

**Why this priority**: Gestionar el avance y corregir los datos de las tareas es la mejora más
valiosa sobre el MVP.

**Independent Test**: Se puede validar de forma autónoma marcando una tarea como completada y/o
editando su texto, y comprobando que el listado refleja los cambios.

**Acceptance Scenarios**:

1. **Given** una tarea en estado "pendiente", **When** el usuario activa el control para completarla, **Then** la tarea pasa a estado "completada" y el listado refleja el cambio.
2. **Given** una tarea en estado "completada", **When** el usuario activa el control para revertir, **Then** la tarea vuelve a "pendiente".
3. **Given** una tarea existente, **When** el usuario edita su título o descripción y guarda, **Then** el listado refleja los nuevos valores.
4. **Given** que el cambio falla, **When** el usuario intenta actualizar, **Then** se muestra un error y el estado visible no cambia de forma incorrecta.

---

### User Story 4 - Eliminar una tarea (Priority: P3)

Como **usuario** necesito **eliminar una tarea que ya no necesito** para **mantener mi lista ordenada
y libre de elementos obsoletos**.

**Why this priority**: Es una operación de mantenimiento importante pero de menor frecuencia.

**Independent Test**: Se puede validar de forma autónoma eliminando una tarea y comprobando que
desaparece del listado.

**Acceptance Scenarios**:

1. **Given** una tarea existente, **When** el usuario solicita eliminarla, **Then** la tarea se elimina y desaparece del listado.
2. **Given** una tarea existente, **When** el usuario solicita eliminarla, **Then** se pide confirmación antes de borrarla (para evitar borrados accidentales).
3. **Given** que la eliminación falla, **When** el usuario intenta eliminar, **Then** se muestra un error y la tarea permanece en el listado.

---

### Edge Cases

- ¿Qué ocurre si la API devuelve un error de red o tarda demasiado? Se muestra un estado de error/carga claro (US1-E3).
- ¿Qué ocurre si el usuario envía el formulario de creación con el título vacío? Se muestra validación y no se envía (US2-E2).
- ¿Qué ocurre si falla la actualización de estado? Se muestra error y el estado no cambia incorrectamente (US3-E3).
- ¿Qué ocurre al eliminar? Se pide confirmación y, si falla, la tarea permanece (US4-E2/E3).
- ¿Qué ocurre si el usuario interactúa con la lista mientras una operación está en curso? Se evita la doble carga o se muestran indicadores de carga.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El frontend DEBE mostrar el listado de tareas obtenido de la API en `GET /api/tasks`, incluyendo título, descripción y estado.
- **FR-002**: El frontend DEBE permitir crear una tarea mediante `POST /api/tasks`, con título obligatorio y descripción opcional.
- **FR-003**: El frontend DEBE permitir alternar el estado de una tarea (pendiente/completada) y editar su título y descripción mediante `PATCH /api/tasks/:id`.
- **FR-004**: El frontend DEBE permitir eliminar una tarea mediante `DELETE /api/tasks/:id`, solicitando confirmación previa.
- **FR-005**: El frontend DEBE validar el título no vacío antes de enviar la creación, mostrando un mensaje claro.
- **FR-006**: El frontend DEBE mostrar estados de carga, vacío y error de forma clara, sin dejarse en un estado inconsistente ante fallos.
- **FR-007**: El frontend DEBE reflejar en pantalla el resultado de cada operación (crear, alternar estado, eliminar) actualizando el listado.
- **FR-008**: El frontend DEBE ser una aplicación web Vanilla JS (HTML/CSS/JS) que consume la API REST existente.

### Key Entities

- **Task**: Representa una tarea mostrada en pantalla. Atributos visibles: título, descripción, estado ("pendiente"/"completada"). Se corresponde con la entidad Task del backend (`specs/001-todo-crud`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario puede ver las tareas existentes en la pantalla en menos de 2 segundos tras cargar la página.
- **SC-002**: El 100% de las tareas creadas desde el frontend aparecen en el listado sin recargar la página manualmente.
- **SC-003**: El 100% de los cambios de estado realizados desde el frontend se reflejan en el listado.
- **SC-004**: El 100% de las tareas eliminadas desde el frontend desaparecen del listado.

## Assumptions

- El frontend consume la API REST existente (`specs/001-todo-crud/contracts/api.md`); no modifica el backend.
- Es una aplicación web de escritorio/móvil responsive básica; no se requiere PWA ni offline.
- No hay autenticación ni gestión de sesión (el backend es single-user).
- No hay ordenamiento ni filtros por estado en v1; el listado es simple y completo.
- El stack es Vanilla JS (HTML/CSS/JS), sin framework ni build system (decisión de planificación).
- La API ya expone CORS, por lo que el frontend servido desde otro origen/port puede consumirla.