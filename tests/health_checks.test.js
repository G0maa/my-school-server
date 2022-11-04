const app = require('../app');
const supertest = require('supertest');
const api = supertest(app);

describe('Health checks', () => {
  test('GET /api/ping', async () => {
    const response = await api.get('/api/ping').expect(200);

    expect(response.text).toContain('<p>pong</p>');
  });

  test('GET /api/failping', async () => {
    await api.get('/api/failping').expect(400);
  });
});
