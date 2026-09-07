const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createTasksRouter } = require('./tasks');

function createApp(db) {
  const app = express();
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use('/api/tasks', createTasksRouter(db));

  app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  });

  return app;
}

module.exports = { createApp };