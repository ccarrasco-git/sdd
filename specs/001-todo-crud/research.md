# Research: Todo List CRUD

Fase 0 del plan. Resuelve las decisiones técnicas y de mejores prácticas para la feature.

## 1. Persistencia: SQLite

- **Decision**: Usar SQLite a través del módulo incorporado de Node `node:sqlite` (`DatabaseSync`).
  Cero dependencias nativas de terceros, API síncrona, sin configuración de servidor.
- **Rationale**: Es una app single-user de bajo volumen. SQLite es embebido y cumple la persistencia
  entre reinicios (archivo `data/tasks.db`). En el entorno de destino, `better-sqlite3` no tenía
  binario precompilado para Node 24 y requería toolchain C++ (no disponible); `node:sqlite` evita
  ese problema por completo y está disponible en Node ≥ 22.5.
- **Alternatives considered**:
  - `better-sqlite3`: binario precompilado ausente para Node 24 + requiere VS C++ para compilar;
    descartado por el entorno.
  - `sqlite3` (callback): mismo problema de compilación nativa.
  - PostgreSQL/MySQL: sobre-ingeniería para este alcance (YAGNI).
  - Almacenamiento en memoria/JSON: no cumple persistencia robusta ni concurrencia.

## 2. Framework HTTP

- **Decision**: Express 4.
- **Rationale**: Estándar de facto en Node para APIs REST; mínimo, bien documentado y suficiente
  para 5 endpoints.
- **Alternatives considered**: Fastify (más rápido pero overkill para este alcance); nada
  (http nativo) implicaría reimplementar routing/parsing.

## 3. Estructura y semántica de la API

- **Decision**: Recursos RESTful con verbos estándar; actualización parcial con **PATCH**
  (clarificado en la spec). JSON como formato; códigos de estado estándar.
- **Rationale**: Alinea con el principio III de la constitución (REST + JSON) y la clarificación
  del usuario.
- **Alternatives considered**: PUT para reemplazo completo (rechazado: requiere reenviar todo);
  GraphQL (overkill).

## 4. Esquema y reglas de negocio

- **Decision**: Tabla `tasks` con columnas `id` (autoincremental), `title` (NOT NULL, no vacío),
  `description` (NULL por defecto), `status` (CHECK en `pending`/`completed`), `created_at`,
  `updated_at`.
- **Rationale**: Refleja la entidad Task de la spec y las reglas FR-001/FR-005/FR-006.
- **Alternatives considered**: UUIDs (innecesario para single-user); timestamps en UTC (se usarán
  ISO 8601 UTC).

## 5. Pruebas

- **Decision**: vitest + supertest; base de datos SQLite en memoria para aislamiento por test.
- **Rationale**: Cumple TDD (constitución II) e integración de contratos (constitución IV) de forma
  ligera. SQLite en memoria hace cada test rápido e independiente.
- **Alternatives considered**: jest (más pesado); pruebas manuales (no cumplen TDD).

## 6. Convenciones de códigos de estado

- **Decision**: `201` al crear, `200` al listar/actualizar, `204` al eliminar, `400` validación,
  `404` no encontrado, `500` error de servidor.
- **Rationale**: REST estándar; facilita contrato claro en `contracts/`.

## Decisiones registradas

| #  | Decisión                          | Alternativas descartadas                     |
|----|-----------------------------------|----------------------------------------------|
| 1  | SQLite via node:sqlite (builtin)  | better-sqlite3, sqlite3, PostgreSQL, JSON     |
| 2  | Express 4                         | Fastify, http nativo                         |
| 3  | REST + PATCH para actualizar      | PUT (reemplazo completo), GraphQL            |
| 4  | Tabla `tasks` con CHECK en status | UUIDs, timestamps locales                    |
| 5  | vitest + supertest                | jest, pruebas manuales                       |
| 6  | Códigos REST estándar             | códigos propietarios                         |