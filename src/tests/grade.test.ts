import supertest from 'supertest';
import { app } from '../app';
import {
  getAdminCredentialsHeader,
  getDummyActiveSubject,
  getDummyStudent,
} from './helpers';
import { ZActiveSubject } from '../validator/activeSubject.validator';
import { ZGrade } from '../validator/grade.validator';

const api = supertest(app);
const gradeRoute = '/api/grade';

let adminHeader: object;
export const dummyActiveSubject: ZActiveSubject = {
  subjectId: '',
  classId: '',
  teacherId: '',
  subjectSchedule: '1,2-3',
};

beforeAll(async () => {
  // P.S: Can be a student too, something code coverage won't get.
  adminHeader = await getAdminCredentialsHeader(api, true);
});

describe('CRUD of Grade', () => {
  test('POST & GET Grade', async () => {
    const dummyActiveSubject = await getDummyActiveSubject();
    const dummyStudent = await getDummyStudent();

    const dummyGrade: ZGrade = {
      activeSubjectId: dummyActiveSubject.serial,
      studentId: dummyStudent.userId,
      yearWork: 25,
      exam: 40,
    };

    const post = await api
      .post(gradeRoute)
      .set(adminHeader)
      .send(dummyGrade)
      .expect(200);

    const get = await api
      .get(`${gradeRoute}/${post.body.serial}`)
      .set(adminHeader)
      .expect(200);

    expect(get.body).toMatchObject(dummyGrade);
  });

  test('Fails when activeSubjectId does not reference an existing activeSubject', async () => {
    const dummyActiveSubject = await getDummyActiveSubject();
    await dummyActiveSubject.destroy();
    const dummyStudent = await getDummyStudent();

    const dummyGrade: ZGrade = {
      activeSubjectId: dummyActiveSubject.serial,
      studentId: dummyStudent.userId,
      yearWork: 25,
      exam: 40,
    };

    await api.post(gradeRoute).set(adminHeader).send(dummyGrade).expect(400);
  });

  test('Fails when studentId does not reference an existing student', async () => {
    const dummyActiveSubject = await getDummyActiveSubject();
    const dummyStudent = await getDummyStudent();
    await dummyStudent.destroy();

    const dummyGrade: ZGrade = {
      activeSubjectId: dummyActiveSubject.serial,
      studentId: dummyStudent.userId,
      yearWork: 25,
      exam: 40,
    };

    await api.post(gradeRoute).set(adminHeader).send(dummyGrade).expect(400);
  });

  test('Fails when exam grade is more than 60', async () => {
    const dummyActiveSubject = await getDummyActiveSubject();
    const dummyStudent = await getDummyStudent();

    const dummyGrade: ZGrade = {
      activeSubjectId: dummyActiveSubject.serial,
      studentId: dummyStudent.userId,
      yearWork: 25,
      exam: 61,
    };

    await api.post(gradeRoute).set(adminHeader).send(dummyGrade).expect(400);
  });
});
