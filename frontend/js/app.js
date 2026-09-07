import { listTasks, createTask, updateTask, deleteTask } from './api.js';
import { renderTasks, renderEmpty } from './render.js';

const listEl = document.getElementById('task-list');
const form = document.getElementById('task-form');
const titleInput = document.getElementById('task-title');
const descInput = document.getElementById('task-desc');
const messageEl = document.getElementById('message');

function showMessage(text, kind = 'error') {
  messageEl.textContent = text;
  messageEl.className = `message message--${kind}`;
  messageEl.hidden = false;
}

function clearMessage() {
  messageEl.hidden = true;
}

async function loadTasks() {
  try {
    const tasks = await listTasks();
    listEl.innerHTML = tasks.length ? renderTasks(tasks) : renderEmpty();
    clearMessage();
  } catch (err) {
    listEl.innerHTML = '';
    showMessage(err.message || 'Error al cargar las tareas');
  }
}

async function handleCreate(e) {
  e.preventDefault();
  const title = titleInput.value.trim();
  if (!title) {
    showMessage('El título es obligatorio');
    return;
  }
  try {
    await createTask({ title, description: descInput.value.trim() || undefined });
    titleInput.value = '';
    descInput.value = '';
    clearMessage();
    await loadTasks();
  } catch (err) {
    showMessage(err.message || 'Error al crear la tarea');
  }
}

async function handleToggle(id, completed) {
  try {
    await updateTask(id, { status: completed ? 'completada' : 'pendiente' });
    await loadTasks();
  } catch (err) {
    showMessage(err.message || 'Error al actualizar la tarea');
  }
}

async function handleEdit(id, current) {
  const title = prompt('Nuevo título:', current.title);
  if (title === null) return;
  const description = prompt('Nueva descripción:', current.description || '');
  try {
    await updateTask(id, { title: title.trim(), description: description.trim() || null });
    await loadTasks();
  } catch (err) {
    showMessage(err.message || 'Error al editar la tarea');
  }
}

async function handleDelete(id) {
  if (!window.confirm('¿Eliminar esta tarea?')) return;
  try {
    await deleteTask(id);
    await loadTasks();
  } catch (err) {
    showMessage(err.message || 'Error al eliminar la tarea');
  }
}

listEl.addEventListener('click', (e) => {
  const li = e.target.closest('li[data-id]');
  if (!li) return;
  const id = Number(li.dataset.id);
  if (e.target.classList.contains('task__toggle')) {
    handleToggle(id, e.target.checked);
  } else if (e.target.classList.contains('task__edit')) {
    const titleEl = li.querySelector('.task__title');
    const descEl = li.querySelector('.task__desc');
    handleEdit(id, { title: titleEl.textContent, description: descEl ? descEl.textContent : '' });
  } else if (e.target.classList.contains('task__delete')) {
    handleDelete(id);
  }
});

form.addEventListener('submit', handleCreate);

loadTasks();