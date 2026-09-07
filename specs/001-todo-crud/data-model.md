# Data Model: Todo List CRUD

Modelo de datos derivado de la especificación (entidad **Task**).

## Entidad: Task

Representa una tarea de la lista. Persistida en la tabla `tasks`.

| Campo         | Tipo       | Restricciones                                  | Descripción                                   |
|---------------|------------|------------------------------------------------|-----------------------------------------------|
| `id`          | integer    | PK, autoincremental                            | Identificador único de la tarea (FR-001)      |
| `title`       | string     | NOT NULL, no vacío (trim)                      | Título obligatorio (FR-001, FR-005)           |
| `description` | string     | NULL por defecto, opcional                     | Descripción opcional (FR-001)                 |
| `status`      | string     | CHECK (`pending` o `completed`), default `pending` | Estado de la tarea (FR-001, FR-003, FR-006)   |
| `created_at`  | string/ISO | NOT NULL, UTC                                   | Fecha de creación (FR-002)                    |
| `updated_at`  | string/ISO | NOT NULL, UTC                                   | Fecha de última actualización (FR-002)        |

## Valores de negocio

- **status**: enumeración cerrada → `pending` | `completed`. Cualquier otro valor se rechaza con
  error de validación (FR-006). Se mapea en la API como `"pendiente"`/`"completada"` según contrato
  (ver `contracts/`) — decisión de representación en la capa de API.
- **title**: se valida no vacío tras quitar espacios (FR-005).
- **updated_at**: se actualiza en cada modificación (FR-003).

## Estados y transiciones

`pending ⇄ completed` — una tarea puede pasar de pendiente a completada y viceversa (FR-003).
La creación siempre inicia en `pending` (FR-001).

## Reglas de persistencia

- SQLite en archivo `data/tasks.db` (producción/desarrollo) y en memoria para tests (FR-008).
- Esquema se crea al arrancar si no existe (migración simple vía `CREATE TABLE IF NOT EXISTS`).