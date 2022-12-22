import supertest from 'supertest';
import { app, initServer } from '../app';
import { loginAdmin } from './helpers';
import { PostTeacher } from '../validator/teacher.validator';

const api = supertest(app);

let sessionId: string;
// #17 WET Code
beforeAll(async () => {
  await initServer();
  await api.get('/deleteAllRecords').expect(200);
  // P.S: If this doesn't return a string, we are in deep trouple.
  sessionId = (await loginAdmin(api)) as string;

  // Can be moved to its own function
  await api.get('/testAuth').set('Cookie', [sessionId]).expect(200);
});

// must not provide username & password as they're auto created.
const dummyTeacher: PostTeacher = {} as PostTeacher;

describe('CRUD of Teacher', () => {
  test('POST & GET simpleified Teacher', async () => {
    let res = await api
      .post('/api/teacher')
      .set('Cookie', [sessionId])
      .send(dummyTeacher)
      .expect(200);

    await api
      .post('/api/teacher')
      .set('Cookie', [sessionId])
      .send(dummyTeacher)
      .expect(200);

    res = await api
      .get(`/api/teacher/${res.body.id}`)
      .set('Cookie', [sessionId])
      .expect(200);
    console.log('Jest: res.body: ', res.body);
  });
});
