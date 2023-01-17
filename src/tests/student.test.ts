import supertest from 'supertest';
import { app } from '../app';
import { ZStudent } from '../validator/student.validator';
import { ZUser } from '../validator/user.validator';
import { getAdminCredentialsHeader, getDummyClass } from './helpers';

const api = supertest(app);
const studentRoute = '/api/student/';

let adminHeader: object;
beforeAll(async () => {
  adminHeader = await getAdminCredentialsHeader(api, true);
});

// must not provide username & password as they're auto created.
const dummyStudent: ZStudent = {
  studyYear: '1',
} as ZStudent;

// TS doesn't recognize that role is automatically created.
const fullStudent = {
  firstName: 'Mohammed',
  lastName: 'Gomaa',
  gender: 'Male',
  mobile: '01013587921',
  registerDate: new Date('2022-12-16'),
  dateOfBirth: new Date('1995-01-01'),
  bloodGroup: 'O+',
  address: 'Egypt',
  email: 'example@example.com',
  studyYear: '1',
  educationType: 'Sciences',
  parentName: 'Gomaa',
  parentPhonenumber: 'Mohammed',
  // role: 'Student',
} as ZStudent & ZUser;

describe('CRUD of Student', () => {
  test('POST & GET simpleified student', async () => {
    await api
      .post(studentRoute)
      .set(adminHeader)
      .send(dummyStudent)
      .expect(200);

    const res = await api
      .post(studentRoute)
      .set(adminHeader)
      .send(dummyStudent)
      .expect(200);

    const get = await api
      .get(`${studentRoute}${res.body.userId}`)
      .set(adminHeader)
      .expect(200);

    expect(get.body.user.role).toMatch('Student');
    expect(get.body.user.username).toMatch('S');
  });

  test('POST & GET full student', async () => {
    const res = await api
      .post(`${studentRoute}?type=full`)
      .set(adminHeader)
      .send(fullStudent)
      .expect(200);

    await api
      .get(`${studentRoute}${res.body.userId}`)
      .set(adminHeader)
      .expect(200);
  });

  test('Success when adding a Student with an existent Class', async () => {
    const classId = (await getDummyClass()).classId;

    const res = await api
      .post(`${studentRoute}`)
      .set(adminHeader)
      .send({ ...dummyStudent, classId })
      .expect(200);

    const res2 = await api
      .get(`${studentRoute}${res.body.userId}`)
      .set(adminHeader)
      .expect(200);

    expect(res2.body.classId).toEqual(classId);
  });

  test('Fails when adding a Student with a non-existent Class', async () => {
    const res = await api
      .post(`${studentRoute}`)
      .set(adminHeader)
      .send({ ...dummyStudent, classId: 'ZZZ000' })
      .expect(400);

    // Dirty coverage of code.
    const allStudentsReq = await api
      .get(studentRoute)
      .set(adminHeader)
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
      .set(adminHeader)
      .send(dummyStudent)
      .expect(200);

    // Dirty coverage of code.
    const allStudentsReq = await api
      .delete(`${studentRoute}${res.body.userId}`)
      .set(adminHeader)
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
