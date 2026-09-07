# Implementation Plan: Frontend Web ToDo

**Branch**: `002-frontend-todo` | **Date**: 2026-09-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-frontend-todo/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command; its definition describes the execution workflow.

## Summary

Construir la interfaz web de la lista de tareas ToDo en **HTML/CSS/Vanilla JS**, servida como sitio
estático y consumiendo la API REST existente (`/api/tasks`). Permite ver, crear, editar
(título/descripción/estado) y eliminar tareas. El stack no requiere build system: se sirve con un
servidor estático (`npx serve`) y la API ya expone CORS. La lógica (api client + render) se valida
con **Vitest**.

## Technical Context

**Language/Version**: JavaScript (Vanilla, ES Modules en el navegador)

**Primary Dependencies**: Sin dependencias de runtime. Dev/test: `vitest`. Servir: `npx serve`.

**Storage**: N/A (el frontend no persiste; delega en la API)

**Testing**: Vitest para pruebas de lógica (api client y funciones de render); validación manual
con `quickstart.md`

**Target Platform**: Navegador web (escritorio y móvil, responsive básico)

**Project Type**: web application (frontend SPA ligera)

**Performance Goals**: Listado visible en < 2s; operaciones reflejadas sin recarga manual (SC-002/003/004)

**Constraints**: Consume la API existente (`specs/001-todo-crud`); Vanilla JS sin build; single-user;
sin PWA/offline

**Scale/Scope**: 1 página, 4 flujos (ver, crear, editar, eliminar), volúmenes pequeños

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Spec-First**: la spec existe y precede al código — ✅ cumple.
- **II. Test-First (NON-NEGOTIABLE)**: pruebas de lógica (api client/render) escritas y aprobadas
  antes de la implementación — ✅ cumple.
- **III. REST API Interface**: el frontend consume la API REST documentada en
  `specs/001-todo-crud/contracts/api.md` — ✅ cumple.
- **IV. Integration Testing**: el contrato UI↔API se valida contra los endpoints reales en
  `quickstart.md` — ✅ cumple.
- **V. Simplicity (YAGNI)**: sin framework, sin build, sin estado global complejo — ✅ cumple.

Sin violaciones. No se requiere Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/002-frontend-todo/
├── plan.md              # Este archivo (/speckit.plan)
├── research.md          # Fase 0 (/speckit.plan)
├── contracts/           # Fase 1 (/speckit.plan) — contrato UI↔API
├── quickstart.md        # Fase 1 (/speckit.plan)
└── tasks.md             # Fase 2 (/speckit.tasks)
```

### Source Code (repository root)

```text
frontend/
├── index.html       # Estructura de la página (listado + formulario)
├── css/
│   └── styles.css    # Estilos (responsive básico)
└── js/
    ├── api.js        # Cliente HTTP de la API (fetch)
    ├── render.js     # Funciones de render del DOM (listado, estados, errores)
    └── app.js        # Orquestación: carga inicial y eventos (create/edit/toggle/delete)

frontend/tests/       # Pruebas Vitest de lógica (api.js, render.js)
├── api.test.js
└── render.test.js
```

**Structure Decision**: Carpeta `frontend/` en la raíz del repo, servida con `npx serve frontend`.
Módulos JS separados por responsabilidad (api client, render, app). Las pruebas Vitest viven en
`frontend/tests/` y consumen la misma lógica modular.

## Complexity Tracking

> No aplica: la fase Constitution Check no registró violaciones.