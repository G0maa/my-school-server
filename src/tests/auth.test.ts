import supertest from 'supertest';
import { app } from '../app';

const api = supertest(app);

const adminCreds = {
  username: 'A0001',
  password: '000000',
};

const wrongAdminCreds = {
  username: 'A0002',
  password: '000000',
};

describe('Try default Admin credentials', () => {
  test('Status 200 When correct credentials & Gives back correct user info', async () => {
    const response = await api
      .post('/api/auth/login')
      .send(adminCreds)
      .expect(200);

    expect(response.body).toMatchObject({
      username: 'A0001',
      role: 'Admin',
    });
  });

  test('Session data presists in Server', async () => {
    const response = await api
      .post('/api/auth/login')
      .send(adminCreds)
      .expect(200);

    // not now eslint
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const sessionId: string = response.headers['set-cookie'];

    const getInfo = await api
      .get('/testAuth')
      .set('Cookie', [sessionId])
      .expect(200);

    expect(getInfo.body).toMatchObject({
      username: 'A0001',
      role: 'Admin',
    });
  });

  test('Status 401 with wrong credentials', async () => {
    await api.post('/api/auth/login').send(wrongAdminCreds).expect(401);
  });

  test('Status 400 with missing some or all credentials', async () => {
    await api.post('/api/auth/login').send({}).expect(400);
  });
});
