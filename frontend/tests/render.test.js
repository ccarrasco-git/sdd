import { describe, it, expect } from 'vitest';
import { renderTasks, renderEmpty, renderError, taskItem, escapeHtml } from '../js/render.js';

describe('escapeHtml', () => {
  it('escapa caracteres HTML peligrosos', () => {
    expect(escapeHtml('<script>"&\'')).toBe('&lt;script&gt;&quot;&amp;&#39;');
  });
});

describe('taskItem', () => {
  it('renderiza el título y la descripción', () => {
    const html = taskItem({ id: 1, title: 'Comprar', description: 'Leche', status: 'pendiente' });
    expect(html).toContain('data-id="1"');
    expect(html).toContain('Comprar');
    expect(html).toContain('Leche');
    expect(html).not.toContain('task--completed');
    expect(html).not.toContain('checked');
  });

  it('marca completada y aplica la clase cuando status es completada', () => {
    const html = taskItem({ id: 2, title: 'X', description: null, status: 'completada' });
    expect(html).toContain('task--completed');
    expect(html).toContain('checked');
    expect(html).not.toContain('task__desc');
  });

  it('escapa el título para evitar inyección de HTML', () => {
    const html = taskItem({ id: 1, title: '<b>mal</b>', description: null, status: 'pendiente' });
    expect(html).not.toContain('<b>mal</b>');
    expect(html).toContain('&lt;b&gt;mal&lt;/b&gt;');
  });
});

describe('renderTasks', () => {
  it('devuelve la lista cuando hay tareas', () => {
    const html = renderTasks([
      { id: 1, title: 'A', description: null, status: 'pendiente' },
      { id: 2, title: 'B', description: null, status: 'completada' }
    ]);
    expect(html).toContain('A');
    expect(html).toContain('B');
    expect(html).toContain('task--completed');
  });

  it('devuelve el estado vacío cuando no hay tareas', () => {
    expect(renderTasks([])).toContain('No hay tareas.');
  });

  it('devuelve el estado vacío cuando se pasa null/undefined', () => {
    expect(renderTasks(undefined)).toContain('No hay tareas.');
  });
});

describe('renderEmpty / renderError', () => {
  it('renderEmpty muestra el mensaje de vacío', () => {
    expect(renderEmpty()).toContain('No hay tareas.');
  });

  it('renderError muestra el mensaje y escapa HTML', () => {
    const html = renderError('Fallo <b>x</b>');
    expect(html).toContain('error');
    expect(html).not.toContain('<b>x</b>');
    expect(html).toContain('&lt;b&gt;x&lt;/b&gt;');
  });
});