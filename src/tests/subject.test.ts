import supertest from 'supertest';
import { app } from '../app';
import { getAdminCredentialsHeader, getDummySubject } from './helpers';
import { ZSubject } from '../validator/subject.validator';
// import Subject from '../models/subject';
import ActiveSubject from '../models/activeSubject';

const api = supertest(app);
const subjectRoute = '/api/subject/';

let adminHeader: object;
beforeAll(async () => {
  // Temporary fix, need to come up/find an actual methodolgy for tests
  // i.e. make test files (at least) completely stand alone,
  // i.e. if other tests run before or after them => it won't affect them ?or affect other tests?
  await ActiveSubject.destroy({ where: {} });
  // await Subject.destroy({});
  // P.S: Can be a student too, something code coverage won't get.
  adminHeader = await getAdminCredentialsHeader(api, true);
});

export const dummySubject: ZSubject = {
  subjectId: 'BSC123',
  studyYear: '1',
  educationType: 'Literature',
};

describe('CRUD of Subject', () => {
  test('POST & GET Subject', async () => {
    // Two requests for testing that the
    // serialization of username works correctly
    await api
      .post(subjectRoute)
      .set(adminHeader)
      .send(dummySubject)
      .expect(200);

    const get = await api
      .get(`${subjectRoute}${dummySubject.subjectId}`)
      .set(adminHeader)
      .expect(200);

    expect(get.body.subjectId).toMatch('BSC123');
    expect(get.body.studyYear).toEqual('1');
  });

  test('Success delete Subject when theres no Referrenetial Integerity', async () => {
    const subjectId = (await getDummySubject()).subjectId;

    await api
      .delete(`${subjectRoute}${subjectId}`)
      .set(adminHeader)
      .expect(200);

    const subjects = await api.get(subjectRoute).set(adminHeader).expect(200);

    expect(subjects.body).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          subjectId: subjectId,
        }),
      ])
    );
  });
});
