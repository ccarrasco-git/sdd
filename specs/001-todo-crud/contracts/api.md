# API Contract: Todo List CRUD

Contrato de interfaz REST para la feature. Formato JSON, códigos de estado estándar.
Base URL sugerida: `http://localhost:3000`.

## Representación del recurso Task

```json
{
  "id": 1,
  "title": "Comprar leche",
  "description": "Leche descremada",
  "status": "pendiente",
  "createdAt": "2026-09-06T12:00:00.000Z",
  "updatedAt": "2026-09-06T12:00:00.000Z"
}
```

- `status` válido: `pendiente` | `completada` (se mapea desde el valor de negocio `pending`/`completed`).
- Campos `createdAt`/`updatedAt` en ISO 8601 UTC.

## Endpoints

### POST `/api/tasks` — Crear tarea

Body:

```json
{
  "title": "Comprar leche",
  "description": "Leche descremada"
}
```

- `title`: obligatorio, no vacío (FR-005).
- `description`: opcional.

Respuestas:
- `201 Created` → recurso Task creado con `status: "pendiente"` (FR-001).
- `400 Bad Request` → body `{"error": "<mensaje>"}` si falta `title` o está vacío.

### GET `/api/tasks` — Listar tareas

Respuestas:
- `200 OK` → array de recursos Task (puede ser vacío, FR-002).

### PATCH `/api/tasks/:id` — Actualizar parcialmente (FR-003)

Body (cualquier subconjunto):

```json
{ "title": "Comprar leche y pan", "status": "completada" }
```

- `title`: no vacío si se envía.
- `status`: `pendiente` | `completada`.
- `description`: texto libre.

Respuestas:
- `200 OK` → recurso Task actualizado.
- `400 Bad Request` → validación fallida (title vacío o status inválido).
- `404 Not Found` → `{"error": "Task no encontrada"}` si `:id` no existe (FR-007).

### DELETE `/api/tasks/:id` — Eliminar tarea (FR-004)

Respuestas:
- `204 No Content` → tarea eliminada.
- `404 Not Found` → `{"error": "Task no encontrada"}` si `:id` no existe (FR-007).

## Errores

Formato consistente para errores:

```json
{ "error": "<mensaje legible>" }
```

- `400 Bad Request`: validación.
- `404 Not Found`: recurso inexistente.
- `500 Internal Server Error`: fallo no controlado.