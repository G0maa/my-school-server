import supertest from 'supertest';
import { app, initServer } from '../app';
import { PostStudent } from '../validator/student.validator';
import { loginAdmin } from './helpers';

const api = supertest(app);

let sessionId: string;
beforeAll(async () => {
  await initServer();
  await api.get('/deleteAllRecords').expect(200);
  // P.S: If this doesn't return a string, we are in deep trouple.
  sessionId = (await loginAdmin(api)) as string;

  // Can be moved to its own function
  await api.get('/testAuth').set('Cookie', [sessionId]).expect(200);
});

// must not provide username & password as they're auto created.
const dummyStudent = {
  class: '1',
} as PostStudent;

describe('CRUD of Student', () => {
  test('POST & GET new student', async () => {
    // const postStudent = await api

    let res = await api
      .post('/api/student')
      .set('Cookie', [sessionId])
      .send(dummyStudent)
      .expect(200);

    await api
      .post('/api/student')
      .set('Cookie', [sessionId])
      .send(dummyStudent)
      .expect(200);

    res = await api
      .get(`/api/student/${res.body.id}`)
      .set('Cookie', [sessionId])
      .expect(200);
    console.log('Jest: res.body: ', res.body);
  });
});
