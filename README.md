# sdd

Lista de tareas ToDo con **API REST** y **frontend web**, desarrollada con la metodología
**Spec-Driven Development** usando [spec-kit](https://spec.kit) (comandos `/speckit.*` en opencode).

## Stack

- **Backend**: Node.js (≥ 22.5) + Express, SQLite vía `node:sqlite` (sin dependencias nativas)
- **Frontend**: HTML/CSS/Vanilla JS (ES Modules), sin framework ni build
- **Tests**: vitest + supertest

## Requisitos

- Node.js ≥ 22.5 (incluye `node:sqlite`)

## Requisitos

- Node.js ≥ 22.5 (incluye `node:sqlite`)

## Instalación

```sh
npm install
```

## Uso

```sh
npm start          # levanta la API en http://localhost:3000
npm run dev        # modo desarrollo (recarga automática)
npm test           # corre las pruebas de integración
```

La base SQLite se crea automáticamente en `data/tasks.db` en el primer arranque.

## API

Endpoints disponibles (contrato completo en [`specs/001-todo-crud/contracts/api.md`](specs/001-todo-crud/contracts/api.md)):

| Método | Ruta                 | Descripción                             |
|--------|----------------------|------------------------------------------|
| POST   | `/api/tasks`         | Crear tarea (title obligatorio)         |
| GET    | `/api/tasks`         | Listar tareas                           |
| PATCH  | `/api/tasks/:id`     | Actualizar parcialmente (título/desc/estado) |
| DELETE | `/api/tasks/:id`     | Eliminar tarea                          |

Estado de tarea: `pendiente` | `completada`.

### Ejemplos

```sh
# Crear
curl -s -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Comprar leche","description":"Descremada"}'

# Listar
curl -s http://localhost:3000/api/tasks

# Marcar completada
curl -s -X PATCH http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" -d '{"status":"completada"}'

# Eliminar
curl -s -X DELETE http://localhost:3000/api/tasks/1
```

## Especificaciones

El ciclo SDD de cada feature queda documentado bajo `specs/`:

- [`specs/001-todo-crud/`](specs/001-todo-crud/) — API backend: `spec.md`, `plan.md`,
  `research.md`, `data-model.md`, `contracts/api.md`, `quickstart.md`, `tasks.md`.
- [`specs/002-frontend-todo/`](specs/002-frontend-todo/) — Frontend web: `spec.md`, `plan.md`,
  `research.md`, `contracts/ui-api.md`, `quickstart.md`, `tasks.md`.

## Frontend web

El frontend (en `frontend/`) consume la API. Para usarlo:

```sh
npm start            # terminal 1: API en http://localhost:3000
npx serve frontend   # terminal 2: frontend en http://localhost:3001
```

Abrir `http://localhost:3001`. Permite ver, crear, editar (título/descripción), alternar estado y
eliminar tareas. La lógica se prueba con:

```sh
npx vitest run frontend/tests
```

Contrato UI↔API en [`specs/002-frontend-todo/contracts/ui-api.md`](specs/002-frontend-todo/contracts/ui-api.md).

## Constitución

Los principios de gobernanza del proyecto están en [`.specify/memory/constitution.md`](.specify/memory/constitution.md)
(Spec-First, Test-First obligatorio, REST API, Simplicidad).