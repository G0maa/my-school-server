import supertest from 'supertest';
import app from '../app';
import { PostStudent } from '../validator/student.validator';
import { loginAdmin } from './helpers';

const api = supertest(app);

let sessionId: string;
beforeAll(async () => {
  // P.S: If this doesn't return a string, we are in deep trouple.
  sessionId = (await loginAdmin(api)) as string;

  // Can be moved to its own function
  await api.get('/testAuth').set('Cookie', [sessionId]).expect(200);
});

// must not provide username & password as they're auto created.
const dummyStudent: PostStudent = {
  class: 'First',
};

describe('CRUD of Student', () => {
  test('POST new student', async () => {
    // const postStudent = await api

    await api
      .post('/api/student')
      .set('Cookie', [sessionId])
      .send(dummyStudent)
      .expect(200);
  });
});
