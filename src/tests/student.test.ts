import supertest from 'supertest';
import { app } from '../app';
import { ZStudentPost } from '../validator/student.validator';
import { getDummyClass, loginAdmin } from './helpers';

const api = supertest(app);
const studentRoute = '/api/student/';

let adminCookie: { Cookie: string };
beforeAll(async () => {
  adminCookie = await loginAdmin(api);
  // Can be moved to its own function
});

// must not provide username & password as they're auto created.
const dummyStudent: ZStudentPost['body'] = {
  role: 'Student',
  userDetails: {},
  student: { studyYear: '1' },
};

// TS doesn't recognize that role is automatically created.
const fullStudent: ZStudentPost['body'] = {
  email: 'example@example.com',
  role: 'Student',
  userDetails: {
    firstName: 'Mohammed',
    lastName: 'Gomaa',
    gender: 'Male',
    mobile: '01013587921',
    registerDate: new Date('2022-12-16'),
    dateOfBirth: new Date('1995-01-01'),
    bloodGroup: 'O+',
    address: 'Egypt',
  },
  student: {
    studyYear: '1',
    educationType: 'Sceiences',
    parentName: 'Gomaa',
    parentPhonenumber: 'Mohammed',
  },
};

describe('CRUD of Student', () => {
  test('POST & GET simpleified student', async () => {
    await api
      .post(studentRoute)
      .set(adminCookie)
      .send(dummyStudent)
      .expect(200);

    const res = await api
      .post(studentRoute)
      .set(adminCookie)
      .send(dummyStudent)
      .expect(200);

    const get = await api
      .get(`${studentRoute}${res.body.id}`)
      .set(adminCookie)
      .expect(200);

    expect(get.body.role).toMatch('Student');
    expect(get.body.username).toMatch('S');
  });

  test('POST & GET full student', async () => {
    const res = await api
      .post(studentRoute)
      .set(adminCookie)
      .send(fullStudent)
      .expect(200);

    const newStudent = await api
      .get(`${studentRoute}${res.body.id}`)
      .set(adminCookie)
      .expect(200);

    expect(newStudent.body.student.parentName).toEqual(
      fullStudent.student.parentName
    );
    expect(newStudent.body.email).toEqual(fullStudent.email);
    expect(newStudent.body.userDetails.bloodGroup).toEqual(
      fullStudent.userDetails.bloodGroup
    );
  });

  test('Success when adding a Student with an existent Class', async () => {
    const classId = (await getDummyClass()).classId;

    const res = await api
      .post(`${studentRoute}`)
      .set(adminCookie)
      .send({ ...dummyStudent, student: { ...dummyStudent.student, classId } })
      .expect(200);

    const res2 = await api
      .get(`${studentRoute}${res.body.id}`)
      .set(adminCookie)
      .expect(200);

    expect(res2.body.student.classId).toEqual(classId);
  });

  test('Fails when adding a Student with a non-existent Class', async () => {
    const res = await api
      .post(`${studentRoute}`)
      .set(adminCookie)
      .send({
        ...dummyStudent,
        student: { ...dummyStudent.student, classId: 'ZZZ000' },
      })
      .expect(400);

    // Dirty coverage of code.
    const allStudentsReq = await api
      .get(studentRoute)
      .set(adminCookie)
      .expect(200);

    expect(allStudentsReq.body).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          userId: res.body.userId,
        }),
      ])
    );
  });

  test('Deletion of a Student without Study Class', async () => {
    const res = await api
      .post(`${studentRoute}`)
      .set(adminCookie)
      .send(dummyStudent)
      .expect(200);

    // Dirty coverage of code.
    const allStudentsReq = await api
      .delete(`${studentRoute}${res.body.id}`)
      .set(adminCookie)
      .expect(200);

    expect(allStudentsReq.body).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          userId: res.body.userId,
        }),
      ])
    );
  });
});
