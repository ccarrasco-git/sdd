const path = require('node:path');
const { openDatabase } = require('./db');
const { createApp } = require('./app');

const db = openDatabase(path.join(__dirname, '..', 'data', 'tasks.db'));
const app = createApp(db);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Todo API escuchando en http://localhost:${port}`);
});