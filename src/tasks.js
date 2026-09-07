const STATUS_OUT = { pending: 'pendiente', completed: 'completada' };
const STATUS_IN = { pendiente: 'pending', completada: 'completed' };

function toTask(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: STATUS_OUT[row.status] ?? row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function createTasksRouter(db) {
  const router = require('express').Router();

  const findById = (id) => db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

  router.post('/', (req, res) => {
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    if (!title) {
      return res.status(400).json({ error: 'El campo "title" es obligatorio y no puede estar vacío' });
    }
    const description = typeof req.body.description === 'string' ? req.body.description : null;
    const now = new Date().toISOString();
    const result = db
      .prepare('INSERT INTO tasks (title, description, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)')
      .run(title, description, 'pending', now, now);
    const row = findById(result.lastInsertRowid);
    res.status(201).json(toTask(row));
  });

  router.get('/', (req, res) => {
    const rows = db.prepare('SELECT * FROM tasks ORDER BY id ASC').all();
    res.status(200).json(rows.map(toTask));
  });

  router.patch('/:id', (req, res) => {
    const id = Number(req.params.id);
    const existing = findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Task no encontrada' });
    }

    const fields = {};
    if ('title' in req.body) {
      const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
      if (!title) {
        return res.status(400).json({ error: 'El campo "title" no puede estar vacío' });
      }
      fields.title = title;
    }
    if ('description' in req.body) {
      fields.description = req.body.description === null ? null : String(req.body.description);
    }
    if ('status' in req.body) {
      const mapped = STATUS_IN[req.body.status];
      if (!mapped) {
        return res.status(400).json({ error: 'El campo "status" debe ser "pendiente" o "completada"' });
      }
      fields.status = mapped;
    }

    const setClause = Object.keys(fields)
      .map((key) => `${key} = ?`)
      .join(', ');
    if (setClause) {
      db.prepare(`UPDATE tasks SET ${setClause}, updated_at = ? WHERE id = ?`).run(
        ...Object.values(fields),
        new Date().toISOString(),
        id
      );
    }
    res.status(200).json(toTask(findById(id)));
  });

  router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const existing = findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Task no encontrada' });
    }
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    res.status(204).end();
  });

  return router;
}

module.exports = { createTasksRouter };