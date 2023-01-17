import supertest from 'supertest';
import { app } from '../app';
import { getAdminCredentialsHeader } from './helpers';
import { ZStudyClass } from '../validator/studyClass.validator';

const api = supertest(app);
const studyClassRoute = '/api/studyClass/';

let adminHeader: object;
beforeAll(async () => {
  // P.S: Can be a student too, something code coverage won't get.
  adminHeader = await getAdminCredentialsHeader(api, true);
});

export const dummyClass: ZStudyClass = {
  classId: 'BSC123',
  studyYear: '1',
  educationType: 'Literature',
};

describe('CRUD of StudyClass', () => {
  test('POST & GET StudyClass', async () => {
    // Two requests for testing that the
    // serialization of username works correctly
    await api
      .post(studyClassRoute)
      .set(adminHeader)
      .send(dummyClass)
      .expect(200);

    const get = await api
      .get(`${studyClassRoute}${dummyClass.classId}`)
      .set(adminHeader)
      .expect(200);

    expect(get.body.classId).toMatch('BSC123');
    expect(get.body.studyYear).toEqual('1');
  });
});
