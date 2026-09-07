export function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return map[c];
  });
}

export function taskItem(task) {
  const completed = task.status === 'completada';
  const desc = task.description
    ? `<p class="task__desc">${escapeHtml(task.description)}</p>`
    : '';
  return `
    <li class="task ${completed ? 'task--completed' : ''}" data-id="${task.id}">
      <input type="checkbox" class="task__toggle" ${completed ? 'checked' : ''} aria-label="Alternar estado">
      <div class="task__body">
        <span class="task__title">${escapeHtml(task.title)}</span>
        ${desc}
      </div>
      <button class="task__edit" type="button">Editar</button>
      <button class="task__delete" type="button">Eliminar</button>
    </li>`;
}

export function renderEmpty() {
  return '<p class="empty">No hay tareas.</p>';
}

export function renderError(message) {
  return `<p class="error">${escapeHtml(message)}</p>`;
}

export function renderTasks(tasks) {
  if (!tasks || tasks.length === 0) return renderEmpty();
  return tasks.map(taskItem).join('');
}