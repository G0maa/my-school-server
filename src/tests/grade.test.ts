import supertest from 'supertest';
import { app } from '../app';
import { getDummyActiveSubject, getDummyStudent, loginAdmin } from './helpers';
import { ZActiveSubject } from '../validator/activeSubject.validator';
import { ZGrade } from '../validator/grade.validator';

const api = supertest(app);
const gradeRoute = '/api/grade';

let adminCookie: { Cookie: string };
export const dummyActiveSubject: ZActiveSubject = {
  subjectId: '',
  classId: '',
  teacherId: '',
  subjectSchedule: '1,2-3',
};

beforeAll(async () => {
  // P.S: Can be a student too, something code coverage won't get.
  adminCookie = await loginAdmin(api);
});

describe('CRUD of Grade (Admin)', () => {
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
      .set(adminCookie)
      .send(dummyGrade)
      .expect(200);

    const get = await api
      .get(`${gradeRoute}/${post.body.serial}`)
      .set(adminCookie)
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

    await api.post(gradeRoute).set(adminCookie).send(dummyGrade).expect(400);
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

    await api.post(gradeRoute).set(adminCookie).send(dummyGrade).expect(400);
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

    await api.post(gradeRoute).set(adminCookie).send(dummyGrade).expect(400);
  });
});

describe('Securtiy of Grade route', () => {
  test('Student can access his grades', async () => {
    const { serial } = await getDummyActiveSubject();
    const { id, username, password } = await getDummyStudent();

    // Assigning a grade to a student.
    const dummyGrade: ZGrade = {
      activeSubjectId: serial,
      studentId: id,
      yearWork: 25,
      exam: 40,
    };

    const post = await api
      .post(gradeRoute)
      .set(adminCookie)
      .send(dummyGrade)
      .expect(200);

    // Logging in as the owner of the grade
    const studentCookie = await loginAdmin(api, { username, password });

    const get = await api
      .get(`${gradeRoute}/${post.body.serial}`)
      .set(studentCookie)
      .expect(200);

    expect(get.body).toMatchObject(dummyGrade);
  });

  test('Student cannot access other students grades', async () => {
    const { serial } = await getDummyActiveSubject();
    const { id } = await getDummyStudent();
    const { username, password } = await getDummyStudent();

    // Assigning a grade to a student.
    const dummyGrade: ZGrade = {
      activeSubjectId: serial,
      studentId: id,
      yearWork: 25,
      exam: 40,
    };

    const post = await api
      .post(gradeRoute)
      .set(adminCookie)
      .send(dummyGrade)
      .expect(200);

    // Logging in as the other student
    const studentCookie = await loginAdmin(api, { username, password });

    const get = await api
      .get(`${gradeRoute}/${post.body.serial}`)
      .set(studentCookie)
      .expect(404);

    expect(get.body).toEqual({ message: 'Fee not found' });
  });
});
