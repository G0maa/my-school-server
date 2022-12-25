import supertest from 'supertest';
import { app } from '../app';
import { loginAdmin } from './helpers';
import { Class, EducationTypes } from '../types';
import { PostStudyClass } from '../validator/studyClass.validator';

const api = supertest(app);
const studyClassRoute = '/api/studyClass/';

let sessionId: string;
beforeAll(async () => {
  // P.S: Can be a student too, something code coverage won't get.
  sessionId = (await loginAdmin(api)) as string;
  await api.get('/testAuth').set('Cookie', [sessionId]).expect(200);
});

export const dummyClass: PostStudyClass = {
  classId: 'BSC123',
  class: Class.First,
  educationType: EducationTypes.Literature,
};

describe('CRUD of StudyClass', () => {
  test('POST & GET StudyClass', async () => {
    // Two requests for testing that the
    // serialization of username works correctly
    await api
      .post(studyClassRoute)
      .set('Cookie', [sessionId])
      .send(dummyClass)
      .expect(200);

    const get = await api
      .get(`${studyClassRoute}${dummyClass.classId}`)
      .set('Cookie', [sessionId])
      .expect(200);

    expect(get.body.classId).toMatch('BSC123');
    expect(get.body.class).toEqual('1');
  });
});
