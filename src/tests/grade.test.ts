import supertest from 'supertest';
import { app } from '../app';
import { getDummyActiveSubject, getDummyStudent, loginAdmin } from './helpers';
import { ZActiveSubject } from '../validator/activeSubject.validator';
import { ZGrade } from '../validator/grade.validator';

const api = supertest(app);
const gradeRoute = '/api/grade';

let sessionId: string;
export const dummyActiveSubject: ZActiveSubject = {
  subjectId: '',
  classId: '',
  teacherId: '',
  subjectSchedule: '1,2-3',
};

beforeAll(async () => {
  // P.S: Can be a student too, something code coverage won't get.
  sessionId = (await loginAdmin(api)) as string;
  await api.get('/testAuth').set('Cookie', [sessionId]).expect(200);
});

describe('CRUD of Grade', () => {
  test('POST & GET Grade', async () => {
    const dummyActiveSubject = await getDummyActiveSubject();
    const dummyStudent = await getDummyStudent();

    const dummyGrade: ZGrade = {
      activeSubjectId: dummyActiveSubject.serial,
      studentId: dummyStudent.id,
      yearWork: 25,
      exam: 40,
    };

    const post = await api
      .post(gradeRoute)
      .set('Cookie', [sessionId])
      .send(dummyGrade)
      .expect(200);

    const get = await api
      .get(`${gradeRoute}/${post.body.serial}`)
      .set('Cookie', [sessionId])
      .expect(200);

    expect(get.body).toMatchObject(dummyGrade);
  });

  test('Fails when activeSubjectId does not reference an existing activeSubject', async () => {
    const dummyActiveSubject = await getDummyActiveSubject();
    await dummyActiveSubject.destroy();
    const dummyStudent = await getDummyStudent();

    const dummyGrade: ZGrade = {
      activeSubjectId: dummyActiveSubject.serial,
      studentId: dummyStudent.id,
      yearWork: 25,
      exam: 40,
    };

    await api
      .post(gradeRoute)
      .set('Cookie', [sessionId])
      .send(dummyGrade)
      .expect(400);
  });

  test('Fails when studentId does not reference an existing student', async () => {
    const dummyActiveSubject = await getDummyActiveSubject();
    const dummyStudent = await getDummyStudent();
    await dummyStudent.destroy();

    const dummyGrade: ZGrade = {
      activeSubjectId: dummyActiveSubject.serial,
      studentId: dummyStudent.id,
      yearWork: 25,
      exam: 40,
    };

    await api
      .post(gradeRoute)
      .set('Cookie', [sessionId])
      .send(dummyGrade)
      .expect(400);
  });

  test('Fails when exam grade is more than 60', async () => {
    const dummyActiveSubject = await getDummyActiveSubject();
    const dummyStudent = await getDummyStudent();

    const dummyGrade: ZGrade = {
      activeSubjectId: dummyActiveSubject.serial,
      studentId: dummyStudent.id,
      yearWork: 25,
      exam: 61,
    };

    await api
      .post(gradeRoute)
      .set('Cookie', [sessionId])
      .send(dummyGrade)
      .expect(400);
  });
});
