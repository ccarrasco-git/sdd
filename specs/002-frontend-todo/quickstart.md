# Quickstart: Frontend Web ToDo

Guía de validación de la feature de punta a punta. Referencia el contrato
(`contracts/ui-api.md`) y la API (`../001-todo-crud/contracts/api.md`).

## Prerequisitos

- Node.js ≥ 22.5 instalado.
- El backend ToDo levantado y sirviendo la API (`npm start` en la raíz del repo, puerto 3000).

## Ejecutar la API (backend)

```sh
# en la raíz del repo
npm start
```

## Ejecutar el frontend (estático)

```sh
npx serve frontend
```

Servido en `http://localhost:3001` (o el puerto que indique `serve`). La API queda en
`http://localhost:3000`.

## Validación manual (flujo CRUD completo)

1. **Ver listado**: abrir `http://localhost:3001`. Si la API tiene tareas, se muestran; si no, se
   ve el estado vacío.
2. **Crear**: completar el formulario (título obligatorio) y enviar. La tarea aparece en el listado
   sin recargar.
3. **Editar texto**: editar título/descripción de una tarea y guardar. El listado refleja el cambio.
4. **Alternar estado**: marcar una tarea como completada (y volver a pendiente). El estado se
   actualiza.
5. **Eliminar**: eliminar una tarea (se pide confirmación). Desaparece del listado.

## Validación automatizada (pruebas de lógica)

```sh
# en la raíz del repo
npx vitest run frontend/tests
```

Corre las pruebas de lógica (api client con fetch mockeado y funciones de render) con Vitest.

## Resultados esperados

- Los 4 flujos (ver, crear, editar, eliminar) se completan contra la API real.
- Estados de carga/vacío/error se muestran correctamente (FR-006).
- El frontend no modifica el backend; la persistencia la garantiza la API (FR-008).