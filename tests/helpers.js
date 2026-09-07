const request = require('supertest');
const { openDatabase } = require('../src/db');
const { createApp } = require('../src/app');

function createTestServer() {
  const db = openDatabase(':memory:');
  const app = createApp(db);
  return { app, db };
}

module.exports = { createTestServer };