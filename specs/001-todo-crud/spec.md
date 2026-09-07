# Feature Specification: Todo List CRUD

**Feature Branch**: `001-todo-crud`

**Created**: 2026-09-06

**Status**: Draft

**Input**: User description: "Gestión de lista de tareas ToDo con operaciones CRUD: crear, listar, actualizar estado, y eliminar tareas, con campos título, descripción y estado (pendiente/completada)."

## Clarifications

### Session 2026-09-06

- Q: ¿El sistema es de un solo usuario o cada tarea pertenece a un usuario? → A: Single-user, sin cuentas ni propietario por tarea.
- Q: ¿La actualización reemplaza todo el recurso o permite editar solo algunos campos? → A: Actualización parcial (PATCH), p. ej. marcar completada sin reenviar título.
- Q: ¿Qué formato de contrato de interfaz se usa para la API REST? → A: Contrato REST + JSON con códigos de estado, documentado en `contracts/`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Crear una tarea (Priority: P1)

Un usuario puede crear una nueva tarea aportando un título y, opcionalmente, una descripción. La
tarea se guarda con estado "pendiente" y queda disponible de inmediato en la lista.

**Why this priority**: Sin crear tareas no existe una lista; es la base de valor del producto.

**Independent Test**: Se puede validar de forma autónoma creando una tarea y comprobando que el
sistema la registra y la devuelve con un identificador propio y estado "pendiente".

**Acceptance Scenarios**:

1. **Given** que no hay tareas guardadas, **When** el usuario crea una tarea con título y descripción, **Then** el sistema la guarda con estado "pendiente" y le asigna un identificador único.
2. **Given** que el usuario aporta solo un título, **When** crea la tarea, **Then** el sistema la guarda igualmente, dejando la descripción vacía.
3. **Given** que el usuario envía una tarea sin título, **When** intenta crearla, **Then** el sistema rechaza la operación con un mensaje claro de error.

---

### User Story 2 - Listar tareas (Priority: P1)

Un usuario puede consultar todas sus tareas, viendo el título, la descripción, el estado y la fecha
de creación de cada una.

**Why this priority**: Ver las tareas es el segundo pilar del producto; junto con crear conforma un
MVP utilizable.

**Independent Test**: Se puede validar de forma autónoma creando varias tareas y comprobando que el
listado las muestra todas con su estado.

**Acceptance Scenarios**:

1. **Given** que existen varias tareas con distintos estados, **When** el usuario solicita el listado, **Then** el sistema devuelve todas las tareas con su título, descripción, estado y fecha de creación.
2. **Given** que no existe ninguna tarea, **When** el usuario solicita el listado, **Then** el sistema responde con una lista vacía sin errores.

---

### User Story 3 - Actualizar una tarea (Priority: P2)

Un usuario puede modificar una tarea existente: editar su título o descripción y/o cambiar su estado
entre "pendiente" y "completada".

**Why this priority**: Gestionar el avance de las tareas es la mejora más solicitada sobre el MVP.

**Independent Test**: Se puede validar de forma autónoma creando una tarea y comprobando que al
marcarla como completada (o editar su texto) el sistema persiste el cambio y lo refleja en el
listado.

**Acceptance Scenarios**:

1. **Given** una tarea existente en estado "pendiente", **When** el usuario la marca como "completada", **Then** el sistema guarda el nuevo estado y lo refleja en el listado.
2. **Given** una tarea existente, **When** el usuario edita su título o descripción, **Then** el sistema persiste los cambios.
3. **Given** un identificador de tarea que no existe, **When** el usuario intenta actualizarla, **Then** el sistema responde con un error indicando que no se encontró.

---

### User Story 4 - Eliminar una tarea (Priority: P3)

Un usuario puede eliminar una tarea existente, retirándola definitivamente de la lista.

**Why this priority**: Es una operación de mantenimiento importante pero de menor frecuencia de uso.

**Independent Test**: Se puede validar de forma autónoma creando y luego eliminando una tarea, y
comprobando que desaparece del listado.

**Acceptance Scenarios**:

1. **Given** una tarea existente, **When** el usuario la elimina, **Then** el sistema la retira de forma permanente y deja de mostrarla en el listado.
2. **Given** un identificador de tarea que no existe, **When** el usuario intenta eliminarla, **Then** el sistema responde con un error indicando que no se encontró.

---

### Edge Cases

- ¿Qué ocurre cuando se intenta crear una tarea sin título? Se rechaza con un mensaje claro (ver US1-E3).
- ¿Cómo maneja el sistema una lista vacía? Devuelve una lista vacía sin errores (ver US2-E2).
- ¿Qué ocurre al actualizar o eliminar una tarea inexistente? Responde con un error de "no encontrado" (ver US3-E3, US4-E2).
- ¿Qué ocurre con estados no reconocidos (p. ej. un estado que no sea "pendiente" o "completada")? El sistema los rechaza con un error de validación.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE permitir crear una tarea con un título obligatorio y una descripción opcional, asignándole un identificador único y estado inicial "pendiente".
- **FR-002**: El sistema DEBE permitir listar todas las tareas con su título, descripción, estado, fecha de creación y fecha de última actualización.
- **FR-003**: El sistema DEBE permitir la actualización parcial de una tarea existente (solo los campos enviados): título, descripción y/o estado, donde el estado DEBE ser "pendiente" o "completada".
- **FR-004**: El sistema DEBE permitir eliminar una tarea existente de forma permanente.
- **FR-005**: El sistema DEBE validar que el título de una tarea no esté vacío.
- **FR-006**: El sistema DEBE rechazar con un error de validación cualquier estado distinto de "pendiente" o "completada".
- **FR-007**: El sistema DEBE devolver un error "no encontrado" al actualizar o eliminar una tarea cuyo identificador no exista.
- **FR-008**: El sistema DEBE persistir las tareas de modo que sobrevivan al reinicio de la aplicación.

### Key Entities

- **Task**: Representa una tarea de la lista. Atributos clave: identificador único, título (obligatorio), descripción (opcional), estado ("pendiente"/"completada"), fecha de creación y fecha de última actualización.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario puede crear una tarea y verla reflejada en el listado en menos de 5 segundos.
- **SC-002**: El 100% de las tareas creadas y no eliminadas están presentes en el listado.
- **SC-003**: El 100% de los cambios de estado guardados se reflejan correctamente en consultas posteriores.
- **SC-004**: Las tareas persisten tras reiniciar la aplicación; no se pierde ninguna tarea guardada.

## Assumptions

- El sistema es de un solo usuario; no se modelan cuentas, roles ni permisos (fuera de alcance para v1).
- No hay ordenamiento personalizado ni filtros por estado en v1; el listado es simple y completo.
- No hay fechas de vencimiento, prioridades, etiquetas ni subtareas en v1.
- La entrada de título/descripción no requiere saneamiento de contenido enriquecido; solo texto plano.
- El stack tecnológico concreto se decide en la fase de planificación (`/speckit.plan`), no en esta especificación.
- La interfaz será una API REST según lo establecido en la constitución del proyecto.