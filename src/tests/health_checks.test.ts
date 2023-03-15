import supertest from 'supertest';
import { app } from '../app';

const api = supertest(app);

describe('Health checks', () => {
  test('GET /api/ping works', async () => {
    const response = await api.get('/api/ping').expect(200);

    expect(response.text).toContain('<p>pong</p>');
  });

  test('No cookies for you, if unauthenticated', async () => {
    const response = await api.get('/api/ping').expect(200);

    expect(response.headers['set-cookie']).toBeUndefined();
  });

  test('GET /testUnAuth does not require authenticated user', async () => {
    await api.get('/api/ping').expect(200);
  });
});
