export const API_BASE = 'http://localhost:3000';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const body = await res.json();
      if (body && body.error) message = body.error;
    } catch {
      // body no es JSON; mantener mensaje por defecto
    }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

function jsonOptions(method, body) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
}

export function listTasks() {
  return request('/api/tasks');
}

export function createTask({ title, description }) {
  const payload = { title };
  if (description) payload.description = description;
  return request('/api/tasks', jsonOptions('POST', payload));
}

export function updateTask(id, fields) {
  return request(`/api/tasks/${id}`, jsonOptions('PATCH', fields));
}

export function deleteTask(id) {
  return request(`/api/tasks/${id}`, { method: 'DELETE' });
}