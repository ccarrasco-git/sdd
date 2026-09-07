import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { createTestServer } from './helpers.js';

let app;

beforeEach(() => {
  app = createTestServer().app;
});

describe('POST /api/tasks (US1 - Crear)', () => {
  it('crea una tarea con título y descripción y devuelve 201 con status pendiente', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'Comprar leche', description: 'Descremada' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe(1);
    expect(res.body.title).toBe('Comprar leche');
    expect(res.body.description).toBe('Descremada');
    expect(res.body.status).toBe('pendiente');
    expect(res.body.createdAt).toBeTruthy();
    expect(res.body.updatedAt).toBeTruthy();
  });

  it('crea una tarea sin descripción', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'Solo titulo' });
    expect(res.status).toBe(201);
    expect(res.body.description).toBeNull();
  });

  it('rechaza 400 cuando el título está vacío o falta', async () => {
    const missing = await request(app).post('/api/tasks').send({});
    expect(missing.status).toBe(400);
    const blank = await request(app).post('/api/tasks').send({ title: '   ' });
    expect(blank.status).toBe(400);
  });
});

describe('GET /api/tasks (US2 - Listar)', () => {
  it('devuelve 200 con la lista de tareas', async () => {
    await request(app).post('/api/tasks').send({ title: 'A' });
    await request(app).post('/api/tasks').send({ title: 'B' });
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body.map((t) => t.title)).toEqual(['A', 'B']);
  });

  it('devuelve 200 con lista vacía cuando no hay tareas', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('PATCH /api/tasks/:id (US3 - Actualizar)', () => {
  it('actualiza solo el estado (marca completada) sin reenviar el resto', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'X' });
    const res = await request(app).patch(`/api/tasks/${created.body.id}`).send({ status: 'completada' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('completada');
    expect(res.body.title).toBe('X');
  });

  it('actualiza título y descripción', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'X' });
    const res = await request(app)
      .patch(`/api/tasks/${created.body.id}`)
      .send({ title: 'Y', description: 'nueva' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Y');
    expect(res.body.description).toBe('nueva');
  });

  it('rechaza 400 con status inválido', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'X' });
    const res = await request(app).patch(`/api/tasks/${created.body.id}`).send({ status: 'en-progreso' });
    expect(res.status).toBe(400);
  });

  it('devuelve 404 cuando la tarea no existe', async () => {
    const res = await request(app).patch('/api/tasks/999').send({ status: 'completada' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/tasks/:id (US4 - Eliminar)', () => {
  it('elimina la tarea y devuelve 204', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'X' });
    const del = await request(app).delete(`/api/tasks/${created.body.id}`);
    expect(del.status).toBe(204);
    const list = await request(app).get('/api/tasks');
    expect(list.body).toEqual([]);
  });

  it('devuelve 404 cuando la tarea no existe', async () => {
    const res = await request(app).delete('/api/tasks/999');
    expect(res.status).toBe(404);
  });
});