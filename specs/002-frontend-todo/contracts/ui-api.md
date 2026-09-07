# UI ↔ API Contract: Frontend Web ToDo

Contrato entre la interfaz web (Vanilla JS) y la API REST existente. Los detalles de formato de los
endpoints están definidos en [`specs/001-todo-crud/contracts/api.md`](../../001-todo-crud/contracts/api.md);
aquí se documenta cómo la UI los consume.

## Base URL de la API

`http://localhost:3000` (CORS habilitado). El frontend se sirve desde un origen/port distinto.

## Operaciones consumidas por la UI

| Flujo UI                    | Petición                        | Body                          | Respuesta esperada      |
|-----------------------------|---------------------------------|-------------------------------|-------------------------|
| Ver listado (US1)           | `GET /api/tasks`                | —                             | `200` array de Task     |
| Crear tarea (US2)           | `POST /api/tasks`               | `{ title, description? }`     | `201` Task              |
| Alternar estado (US3)       | `PATCH /api/tasks/:id`          | `{ status: "pendiente"|"completada" }` | `200` Task   |
| Editar texto (US3)          | `PATCH /api/tasks/:id`          | `{ title?, description? }`    | `200` Task              |
| Eliminar tarea (US4)        | `DELETE /api/tasks/:id`         | —                             | `204`                   |

## Contrato del cliente (módulo `api.js`)

| Función       | Parámetros                         | Retorna                          | Lanza si                    |
|---------------|------------------------------------|----------------------------------|-----------------------------|
| `listTasks()` | —                                  | `Promise<Task[]>`                | error de red / no 2xx       |
| `createTask({title, description?})` | `{title, description?}` | `Promise<Task>`                  | `400` (title vacío) u otro  |
| `updateTask(id, {title?, description?, status?})` | id + campos | `Promise<Task>`     | `400`/`404`                 |
| `deleteTask(id)` | id                            | `Promise<void>`                  | `404`                       |

**Task** (viene de la API):

```json
{ "id": 1, "title": "...", "description": "...", "status": "pendiente", "createdAt": "...", "updatedAt": "..." }
```

## Manejo de errores en la UI

- Cualquier respuesta no satisfactoria (`4xx`/`5xx`) o fallo de red se traduce en un mensaje
  legible al usuario (FR-006).
- La UI nunca deja un estado visual inconsistente ante fallos (US1-E3, US3-E4, US4-E3).

## Estados de UI requeridos

- Carga: mientras se obtiene el listado (FR-006).
- Vacío: cuando la API devuelve `[]` (US1-E2).
- Error: cuando la API falla o es inaccesible (US1-E3).