# Implementation Plan: Todo List CRUD

**Branch**: `001-todo-crud` | **Date**: 2026-09-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-todo-crud/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command; its definition describes the execution workflow.

## Summary

Construir una API REST para la gestión de una lista de tareas ToDo con operaciones CRUD
(crear, listar, actualizar parcialmente y eliminar). La especificación define la entidad **Task**
con título (obligatorio), descripción (opcional), estado (`pendiente`/`completada`), y fechas de
creación y actualización. El sistema es single-user, se expone como API REST en JSON (contrato en
`contracts/`), y las tareas deben persistir entre reinicios. Stack elegido: **Node.js + Express +
SQLite**, con pruebas con **vitest + supertest**.

## Technical Context

**Language/Version**: Node.js LTS (≥ 22.5, soporte estable de `node:sqlite`) — CommonJS

**Primary Dependencies**: express (HTTP routing), cors, morgan (logging). Persistencia mediante el
módulo incorporado `node:sqlite` (DatabaseSync) — sin dependencia nativa de compilación.

**Storage**: SQLite en un archivo local (`data/tasks.db`)

**Testing**: vitest (runner) + supertest (pruebas HTTP) + better-sqlite3 en memoria para tests

**Target Platform**: Servidor local / desarrollo; interfaz REST consumida por cualquier cliente HTTP

**Project Type**: web-service (API REST)

**Performance Goals**: Bajo volumen (lista personal ToDo); p95 < 100ms en operaciones CRUD

**Constraints**: Persistencia requerida (FR-008); tareas deben sobrevivir reinicios; operación
single-user

**Scale/Scope**: 1 entidad (Task), 5 endpoints, volúmenes pequeños (cientos de tareas)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Spec-First**: la spec existe y precede al código — ✅ cumple.
- **II. Test-First (NON-NEGOTIABLE)**: se escribirán y aprobarán pruebas que fallan antes de
  implementar, siguiendo Red-Green-Refactor — ✅ cumple.
- **III. REST API Interface**: la feature se expone como API REST con contratos documentados en
  `contracts/` — ✅ cumple.
- **IV. Integration Testing**: contratos de endpoints cubiertos por pruebas de integración vía
  supertest — ✅ cumple.
- **V. Simplicity (YAGNI)**: sin autenticación, usuarios, filtros ni ordenamiento no requeridos por
  la spec — ✅ cumple.
- **Persistence requerida** (Technology Constraints): SQLite persiste en archivo — ✅ cumple.

Sin violaciones. No se requiere la sección Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-crud/
├── plan.md              # Este archivo (/speckit.plan)
├── research.md          # Fase 0 (/speckit.plan)
├── data-model.md        # Fase 1 (/speckit.plan)
├── quickstart.md        # Fase 1 (/speckit.plan)
├── contracts/           # Fase 1 (/speckit.plan)
└── tasks.md             # Fase 2 (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app.js          # Configuración de la aplicación Express (middleware + rutas)
├── server.js       # Punto de entrada: levanta el servidor sobre app.js
├── db.js           # Inicialización de SQLite (esquema + conexión)
└── tasks.js        # Router Express con la lógica CRUD de tareas

tests/
├── tasks.test.js   # Pruebas de integración HTTP sobre los endpoints

data/               # Directorio para el archivo SQLite (tasks.db, gitignored)
package.json
.gitignore
```

**Structure Decision**: Proyecto único de API REST en la raíz del repositorio (`src/` + `tests/`).
Sin frontend ni separación por paquetes, acorde al principio de Simplicidad.

## Complexity Tracking

> No aplica: la fase Constitution Check no registró violaciones.