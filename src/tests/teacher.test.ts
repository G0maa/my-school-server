import supertest from 'supertest';
import { app } from '../app';
import { ZTeacherPost } from '../validator/teacher.validator';
import { dummyActiveSubject } from './activeSubject.test';
import { getDummyTeacher, loginAdmin } from './helpers';

const api = supertest(app);
const teacherRoute = '/api/teacher/';

let adminCookie: { Cookie: string };
beforeAll(async () => {
  // jest.setTimeout(20000);
  adminCookie = await loginAdmin(api);
  // Can be moved to its own function
});

// must not provide username & password as they're auto created.
const dummyTeacher: ZTeacherPost['body'] = {
  user: { role: 'Teacher' },
  userDetails: {},
  teacher: {},
};
const fullTeacher: ZTeacherPost['body'] = {
  user: {
    email: 'exampleTeacher@example.com', // email is unique in table users
    role: 'Teacher',
  },
  userDetails: {
    firstName: 'Mohammed',
    lastName: 'Gomaa',
    gender: 'Male',
    mobile: '01013587921',
    // Zod schema => (coerced) date from string, but in TS it's descriped as Date
    registerDate: '2022-12-16' as unknown as Date,
    dateOfBirth: '1995-01-01' as unknown as Date,
    bloodGroup: 'O+',
    address: 'Egypt',
  },
  teacher: { department: 'CS', education: 'HTI' },
};

describe('CRUD of Teacher', () => {
  test('POST & GET simpleified Teacher', async () => {
    // Two requests for testing that the
    // serialization of username works correctly
    await api
      .post(teacherRoute)
      .set(adminCookie)
      .send(dummyTeacher)
      .expect(200);

    const res = await api
      .post(teacherRoute)
      .set(adminCookie)
      .send(dummyTeacher)
      .expect(200);

    const get = await api
      .get(`${teacherRoute}${res.body.id}`)
      .set(adminCookie)
      .expect(200);

    expect(get.body.role).toEqual('Teacher');
    expect(get.body.username).toMatch('T');
  });

  test('POST & GET full teacher', async () => {
    const res = await api
      .post(teacherRoute)
      .set(adminCookie)
      .send(fullTeacher)
      .expect(200);

    const newTeacher = await api
      .get(`${teacherRoute}${res.body.id}`)
      .set(adminCookie)
      .expect(200);

    expect(newTeacher.body.teacher.department).toEqual(
      fullTeacher.teacher.department
    );
    expect(newTeacher.body.email).toEqual(fullTeacher.user.email);
    expect(newTeacher.body.userDetails.bloodGroup).toEqual(
      fullTeacher.userDetails.bloodGroup
    );
  });

  test('Success delete Teacher when theres no Referrenetial Integerity', async () => {
    const teacher = await api
      .post(teacherRoute)
      .set(adminCookie)
      .send(dummyTeacher)
      .expect(200);

    await api
      .delete(`${teacherRoute}${teacher.body.id}`)
      .set(adminCookie)
      .expect(200);

    const teachers = await api.get(teacherRoute).set(adminCookie).expect(200);

    // till I get familiar with this syntax
    // src: https://medium.com/@andrei.pfeiffer/jest-matching-objects-in-array-50fe2f4d6b98
    expect(teachers.body).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          userId: teacher.body.userId,
        }),
      ])
    );
  });

  test('Success when Teacher is attached to an ActiveSubject', async () => {
    const teacher = await api
      .post(teacherRoute)
      .set(adminCookie)
      .send(dummyTeacher)
      .expect(200);

    await api
      .post('/api/activeSubject')
      .set(adminCookie)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      .send({ ...dummyActiveSubject, teacherId: teacher.body.id })
      .expect(200);

    await api
      .delete(`${teacherRoute}${teacher.body.id}`)
      .set(adminCookie)
      .expect(200);
  });
});

// Few problems: To-Do
// 1. Tests should work regardless of what other tests made,
//  i.e. flush changes using beforeEach or something.
// 2. createUser() does not return types of included models.
// 3. Keep a consistent structure of CRUD requests
// i.e. POST takes 3 objects, should also return 3 objects.
describe('Security of Teacher API', () => {
  test('A Teacher can change his own details', async () => {
    const teacher = { ...fullTeacher };
    teacher.user.email = 'test@teacher.com';

    const teacherPost = await api
      .post(teacherRoute)
      .set(adminCookie)
      .send(teacher)
      .expect(200);

    const ownerCookie = await loginAdmin(api, {
      username: teacherPost.body.username as string,
      password: teacherPost.body.password as string,
    });

    const changedTeacher = { ...teacher };
    changedTeacher.user.email = 'teacher@example.com';
    changedTeacher.teacher.department = 'IT';
    changedTeacher.userDetails.firstName = 'Taha';

    await api
      .put(`${teacherRoute}/${teacherPost.body.id}`)
      .set(ownerCookie)
      .send(changedTeacher)
      .expect(200);

    const resGet = await api
      .get(`${teacherRoute}/${teacherPost.body.id}`)
      .set(ownerCookie)
      .expect(200);

    // Verifying that get also reflected the new change
    // expect(resGet.body).toMatchObject(putTeacher);
    expect(resGet.body.email).toEqual(changedTeacher.user.email);
    expect(resGet.body.userDetails.lastName).toEqual(
      changedTeacher.userDetails.lastName
    );
    expect(resGet.body.teacher.department).toEqual(
      changedTeacher.teacher.department
    );
  });

  test('Other users cannot change a teacher data (non resource owners)', async () => {
    const teacher = { ...fullTeacher };
    teacher.user.email = 'test1@teacher.com';

    const teacherPost = await api
      .post(teacherRoute)
      .set(adminCookie)
      .send(teacher)
      .expect(200);

    const { username, password } = await getDummyTeacher();
    const otherTeacherCookie = await loginAdmin(api, {
      username,
      password,
    });

    const changedTeacher = structuredClone(teacher);
    changedTeacher.user.email = 'teacher@example.com';
    changedTeacher.teacher.department = 'IT';
    changedTeacher.userDetails.firstName = 'Taha';

    await api
      .put(`${teacherRoute}/${teacherPost.body.id}`)
      .set(otherTeacherCookie)
      .send(changedTeacher)
      .expect(403);

    const resGet = await api
      .get(`${teacherRoute}/${teacherPost.body.id}`)
      .set(otherTeacherCookie)
      .expect(200);

    // expect(resGet.body).toMatchObject(putTeacher);
    expect(resGet.body.email).toEqual(teacher.user.email);
    expect(resGet.body.userDetails.lastName).toEqual(
      teacher.userDetails.lastName
    );
    expect(resGet.body.teacher.department).toEqual(teacher.teacher.department);
  });
});
