import supertest from 'supertest';
import { app } from '../app';
import { loginAdmin } from './helpers';
import { PostSubject } from '../validator/subject.validator';
import { Class, EducationTypes } from '../types';

const api = supertest(app);
const subjectRoute = '/api/subject/';

let sessionId: string;
beforeAll(async () => {
  // P.S: Can be a student too, something code coverage won't get.
  sessionId = (await loginAdmin(api)) as string;
  await api.get('/testAuth').set('Cookie', [sessionId]).expect(200);
});

const dummySubject: PostSubject = {
  subjectId: 'BSC123',
  class: Class.First,
  educationType: EducationTypes.Literature,
};

describe('CRUD of Subject', () => {
  test('POST & GET Subject', async () => {
    // Two requests for testing that the
    // serialization of username works correctly
    await api
      .post(subjectRoute)
      .set('Cookie', [sessionId])
      .send(dummySubject)
      .expect(200);

    const get = await api
      .get(`${subjectRoute}${dummySubject.subjectId}`)
      .set('Cookie', [sessionId])
      .expect(200);

    expect(get.body.subjectId).toMatch('BSC123');
    expect(get.body.class).toEqual('1');
  });
});
