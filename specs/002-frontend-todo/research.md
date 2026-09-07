# Research: Frontend Web ToDo

Fase 0 del plan. Decisiones técnicas y de mejores prácticas para la feature.

## 1. Framework / stack

- **Decision**: HTML/CSS/Vanilla JS (ES Modules), sin framework ni build system.
- **Rationale**: Es una SPA ligera de 4 flujos sobre una API ya resuelta. Vanilla JS cumple los
  requisitos con cero dependencias y alineado al principio de Simplicidad (YAGNI).
- **Alternatives considered**:
  - React + Vite: mayor complejidad, toolchain y node_modules para un alcance simple; descartado.
  - Vue/Svelte: mismo razonamiento.
  - Server-side rendering: no aporta valor para una UI sobre una API REST existente.

## 2. Servir la aplicación

- **Decision**: Sitio estático servido con `npx serve frontend` (o cualquier servidor estático) en
  un origen/port distinto al de la API (`http://localhost:3000`).
- **Rationale**: Cero build, fiel al stack elegido. La API ya expone CORS (usado `cors()` en el
  backend), por lo que el frontend puede consumirla cross-origin sin cambios.
- **Alternatives considered**: Servir los estáticos desde el propio Express (misma app/origen, sin
  CORS) — válido pero mezcla frontend/backend en la feature previa; se mantienen separados.

## 3. Cliente HTTP

- **Decision**: `fetch` nativo del navegador, envuelto en un módulo `api.js` con funciones
  `listTasks`, `createTask`, `updateTask`, `deleteTask`.
- **Rationale**: Nativo, sin dependencias. Encapsular el fetch facilita el testeo con Vitest (mock
  de fetch) y la reutilización.
- **Alternatives considered**: axios (dependencia extra innecesaria); llamadas fetch dispersas por
  el código (menos testable).

## 4. Manejo de estado / render

- **Decision**: Estado mínimo en el DOM, con funciones de render puras en `render.js` que reciben
  datos y devuelven/actualizan markup. `app.js` orquesta la carga inicial y los eventos.
- **Rationale**: Sencillo de testear (funciones puras) y suficiente para el volumen de la feature.
- **Alternatives considered**: estado global (overkill); frameworks reactivos (descartados en #1).

## 5. Pruebas

- **Decision**: Vitest para las funciones puras (`api.js` con fetch mockeado, `render.js`).
- **Rationale**: Cumple TDD (constitución II) e integración de contrato (constitución IV). Reutiliza
  la infraestructura de test ya instalada en el repo.
- **Alternatives considered**: jsdom + testing-library (más pesado para lógica simple); pruebas
  manuales solamente (no cumplen TDD).

## Decisiones registradas

| #  | Decisión                        | Alternativas descartadas                   |
|----|---------------------------------|--------------------------------------------|
| 1  | Vanilla JS (ES Modules)         | React+Vite, Vue, Svelte, SSR               |
| 2  | Servidor estático (npx serve)   | Servir desde Express (mezclar orígenes)    |
| 3  | fetch nativo en api.js          | axios, fetch disperso                      |
| 4  | Render puro + orquestación app  | estado global, frameworks reactivos        |
| 5  | Vitest (lógica pura)            | jsdom+testing-library, solo manual         |