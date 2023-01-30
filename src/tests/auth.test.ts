import supertest from 'supertest';
import { app } from '../app';
import { ZRole } from '../validator/general.validator';

const api = supertest(app);

// #17 WET Code or is it?
const adminCreds = { username: 'A0001', password: '000000' };
const studentCreds = { username: 'S0001', password: '000000' };
const teacherCreds = { username: 'T0001', password: '000000' };
const wrongAdminCreds = { username: 'A0002', password: '000000' };

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
});

describe('Trying with default Student Credentials', () => {
  test('Status 200 When correct credentials & Gives back correct user info', async () => {
    const response = await api
      .post('/api/auth/login')
      .send(studentCreds)
      .expect(200);

    expect(response.body).toMatchObject({
      username: 'S0001',
      role: ZRole.enum.Student,
    });
  });
});

describe('Trying with default Teacher Credentials', () => {
  test('Status 200 When correct credentials & Gives back correct user info', async () => {
    const response = await api
      .post('/api/auth/login')
      .send(teacherCreds)
      .expect(200);

    expect(response.body).toMatchObject({
      username: 'T0001',
      role: ZRole.enum.Teacher,
    });
  });
});

describe('Trying evil scenarios', () => {
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
      .set({ Cookie: sessionId })
      .expect(200);

    expect(getInfo.body).toMatchObject({
      username: 'A0001',
      role: ZRole.enum.Admin,
    });
  });

  test('Status 401 with wrong credentials', async () => {
    await api.post('/api/auth/login').send(wrongAdminCreds).expect(401);
  });

  test('Status 400 with missing some or all credentials', async () => {
    await api.post('/api/auth/login').send({}).expect(400);
  });
});
