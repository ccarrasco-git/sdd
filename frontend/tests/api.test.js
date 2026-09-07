import { describe, it, expect, vi, afterEach } from 'vitest';
import { listTasks, createTask, updateTask, deleteTask, API_BASE } from '../js/api.js';

function mockFetch(status, body) {
  const ok = status >= 200 && status < 300;
  const res = {
    ok,
    status,
    async json() {
      if (typeof body === 'string') throw new Error('invalid json');
      return body;
    }
  };
  return vi.fn().mockResolvedValue(res);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('listTasks', () => {
  it('devuelve el listado de tareas cuando la respuesta es 200', async () => {
    const tasks = [{ id: 1, title: 'A', status: 'pendiente' }];
    vi.stubGlobal('fetch', mockFetch(200, tasks));
    await expect(listTasks()).resolves.toEqual(tasks);
    expect(fetch).toHaveBeenCalledWith(`${API_BASE}/api/tasks`, {});
  });

  it('devuelve una lista vacía cuando la respuesta es 200 con []', async () => {
    vi.stubGlobal('fetch', mockFetch(200, []));
    await expect(listTasks()).resolves.toEqual([]);
  });

  it('lanza error con el mensaje del body cuando la respuesta no es 2xx', async () => {
    vi.stubGlobal('fetch', mockFetch(500, { error: 'Error interno del servidor' }));
    await expect(listTasks()).rejects.toThrow('Error interno del servidor');
  });

  it('lanza error cuando el fetch falla por red', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Failed to fetch')));
    await expect(listTasks()).rejects.toThrow('Failed to fetch');
  });
});

describe('createTask', () => {
  it('envía POST con JSON y devuelve la tarea creada (201)', async () => {
    const created = { id: 2, title: 'Nueva', status: 'pendiente' };
    const fetchMock = mockFetch(201, created);
    vi.stubGlobal('fetch', fetchMock);
    await expect(createTask({ title: 'Nueva', description: 'desc' })).resolves.toEqual(created);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe(`${API_BASE}/api/tasks`);
    expect(opts.method).toBe('POST');
    expect(JSON.parse(opts.body)).toEqual({ title: 'Nueva', description: 'desc' });
  });

  it('omite la descripción cuando no se provee', async () => {
    const fetchMock = mockFetch(201, { id: 3, title: 'X' });
    vi.stubGlobal('fetch', fetchMock);
    await createTask({ title: 'X' });
    const [, opts] = fetchMock.mock.calls[0];
    expect(JSON.parse(opts.body)).toEqual({ title: 'X' });
  });

  it('lanza error 400 cuando el título está vacío', async () => {
    vi.stubGlobal('fetch', mockFetch(400, { error: 'El campo "title" es obligatorio' }));
    await expect(createTask({ title: '' })).rejects.toThrow('El campo "title" es obligatorio');
  });
});

describe('updateTask', () => {
  it('envía PATCH y devuelve la tarea actualizada (200)', async () => {
    const updated = { id: 1, title: 'A', status: 'completada' };
    const fetchMock = mockFetch(200, updated);
    vi.stubGlobal('fetch', fetchMock);
    await expect(updateTask(1, { status: 'completada' })).resolves.toEqual(updated);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe(`${API_BASE}/api/tasks/1`);
    expect(opts.method).toBe('PATCH');
    expect(JSON.parse(opts.body)).toEqual({ status: 'completada' });
  });

  it('lanza error 404 cuando la tarea no existe', async () => {
    vi.stubGlobal('fetch', mockFetch(404, { error: 'Task no encontrada' }));
    await expect(updateTask(999, { status: 'completada' })).rejects.toThrow('Task no encontrada');
  });
});

describe('deleteTask', () => {
  it('envía DELETE y resuelve con null cuando responde 204', async () => {
    const fetchMock = mockFetch(204, null);
    vi.stubGlobal('fetch', fetchMock);
    await expect(deleteTask(1)).resolves.toBeNull();
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe(`${API_BASE}/api/tasks/1`);
    expect(opts.method).toBe('DELETE');
  });

  it('lanza error 404 cuando la tarea no existe', async () => {
    vi.stubGlobal('fetch', mockFetch(404, { error: 'Task no encontrada' }));
    await expect(deleteTask(999)).rejects.toThrow('Task no encontrada');
  });
});