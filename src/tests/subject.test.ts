import supertest from 'supertest';
import { app } from '../app';
import { loginAdmin } from './helpers';
import { ZSubject } from '../validator/subject.validator';

const api = supertest(app);
const subjectRoute = '/api/subject/';

let sessionId: string;
beforeAll(async () => {
  // P.S: Can be a student too, something code coverage won't get.
  sessionId = (await loginAdmin(api)) as string;
  await api.get('/testAuth').set('Cookie', [sessionId]).expect(200);
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
      .set('Cookie', [sessionId])
      .send(dummySubject)
      .expect(200);

    const get = await api
      .get(`${subjectRoute}${dummySubject.subjectId}`)
      .set('Cookie', [sessionId])
      .expect(200);

    expect(get.body.subjectId).toMatch('BSC123');
    expect(get.body.studyYear).toEqual('1');
  });

  test('Success delete Subject when theres no Referrenetial Integerity', async () => {
    const subject = await api
      .post(subjectRoute)
      .set('Cookie', [sessionId])
      .send(dummySubject)
      .expect(200);

    await api
      .delete(`${subjectRoute}${subject.body.subjectId}`)
      .set('Cookie', [sessionId])
      .expect(200);

    const subjects = await api
      .get(subjectRoute)
      .set('Cookie', [sessionId])
      .expect(200);

    expect(subjects.body).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          subjectId: subject.body.subjectId,
        }),
      ])
    );
  });
});
