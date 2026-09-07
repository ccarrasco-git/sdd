# sdd

API REST CRUD de lista de tareas ToDo, desarrollada con la metodología **Spec-Driven Development**
usando [spec-kit](https://spec.kit) (comandos `/speckit.*` en opencode).

## Stack

- Node.js (≥ 22.5) + Express
- SQLite mediante el módulo incorporado `node:sqlite` (sin dependencias nativas)
- Tests: vitest + supertest

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

El ciclo SDD para esta feature queda documentado en [`specs/001-todo-crud/`](specs/001-todo-crud/):
`spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/api.md`, `quickstart.md` y
`tasks.md`.

## Constitución

Los principios de gobernanza del proyecto están en [`.specify/memory/constitution.md`](.specify/memory/constitution.md)
(Spec-First, Test-First obligatorio, REST API, Simplicidad).