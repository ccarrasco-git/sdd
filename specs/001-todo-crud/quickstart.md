# Quickstart: Todo List CRUD

Guía de validación de la feature de punta a punta. Referencia los contratos (`contracts/api.md`) y el
modelo de datos (`data-model.md`) sin duplicarlos.

## Prerequisitos

- Node.js ≥ 18 instalado.
- Este repositorio clonado.

## Setup

```sh
npm install
```

## Ejecutar la API

```sh
npm start
```

Servidor en `http://localhost:3000`. La base se crea en `data/tasks.db` al primer arranque.

## Validación manual (flujo CRUD completo)

1. **Crear** una tarea:

   ```sh
   curl -s -X POST http://localhost:3000/api/tasks \
     -H "Content-Type: application/json" \
     -d '{"title":"Comprar leche","description":"Descremada"}'
   ```

   Esperado: `201` con el recurso y `status: "pendiente"`.

2. **Listar** tareas:

   ```sh
   curl -s http://localhost:3000/api/tasks
   ```

   Esperado: `200` con un array que contiene la tarea creada.

3. **Actualizar parcialmente** (marcar completada):

   ```sh
   curl -s -X PATCH http://localhost:3000/api/tasks/1 \
     -H "Content-Type: application/json" -d '{"status":"completada"}'
   ```

   Esperado: `200` con `status: "completada"`.

4. **Eliminar**:

   ```sh
   curl -s -X DELETE http://localhost:3000/api/tasks/1
   ```

   Esperado: `204`. Al listar de nuevo, la tarea ya no aparece.

## Validación automatizada

```sh
npm test
```

Corre las pruebas de integración HTTP (supertest) sobre los endpoints definidos en el contrato,
usando una base SQLite en memoria.

## Resultados esperados

- Los 4 escenarios CRUD del contrato devuelven los códigos y cuerpos documentados.
- Casos de error cubiertos: crear sin título (`400`), actualizar/eliminar id inexistente (`404`),
  status inválido (`400`).
- Las tareas persisten tras reiniciar la app (FR-008).