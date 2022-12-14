import supertest from 'supertest';
import { app } from '../app';
import { ZTeacher } from '../validator/teacher.validator';
import { ZUser } from '../validator/user.validator';
import { dummyActiveSubject } from './activeSubject.test';
import { loginAdmin } from './helpers';

const api = supertest(app);
const teacherRoute = '/api/teacher/';

let sessionId: string;
beforeAll(async () => {
  // jest.setTimeout(20000);
  sessionId = (await loginAdmin(api)) as string;
  // Can be moved to its own function
  await api.get('/testAuth').set('Cookie', [sessionId]).expect(200);
});

// must not provide username & password as they're auto created.
const dummyTeacher: ZTeacher = {};
const fullTeacher = {
  firstName: 'Mohammed',
  lastName: 'Gomaa',
  gender: 'Male',
  mobile: '01013587921',
  registerDate: new Date('2022-12-16'),
  dateOfBirth: new Date('1995-01-01'),
  bloodGroup: 'O+',
  address: 'Egypt',
  email: 'exampleTeacher@example.com', // email is unique in table users
  department: 'CS',
  education: 'HTI',
  // This can be safely omitted, although TS will complain.
  // it's given by default in the backend.
  // role: 'Teacher',
} as ZTeacher & ZUser;

describe('CRUD of Teacher', () => {
  test('POST & GET simpleified Teacher', async () => {
    // Two requests for testing that the
    // serialization of username works correctly
    await api
      .post(teacherRoute)
      .set('Cookie', [sessionId])
      .send(dummyTeacher)
      .expect(200);

    const res = await api
      .post(teacherRoute)
      .set('Cookie', [sessionId])
      .send(dummyTeacher)
      .expect(200);

    const get = await api
      .get(`${teacherRoute}${res.body.userId}`)
      .set('Cookie', [sessionId])
      .expect(200);

    expect(get.body.user.role).toEqual('Teacher');
    expect(get.body.user.username).toMatch('T');
  });

  test('POST & GET full teacher', async () => {
    const res = await api
      .post(`${teacherRoute}?type=full`)
      .set('Cookie', [sessionId])
      .send(fullTeacher)
      .expect(200);

    await api
      .get(`${teacherRoute}${res.body.userId}`)
      .set('Cookie', [sessionId])
      .expect(200);
  });

  test('Success delete Teacher when theres no Referrenetial Integerity', async () => {
    const teacher = await api
      .post(teacherRoute)
      .set('Cookie', [sessionId])
      .send(dummyTeacher)
      .expect(200);

    await api
      .delete(`${teacherRoute}${teacher.body.userId}`)
      .set('Cookie', [sessionId])
      .expect(200);

    const teachers = await api
      .get(teacherRoute)
      .set('Cookie', [sessionId])
      .expect(200);

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
      .set('Cookie', [sessionId])
      .send(dummyTeacher)
      .expect(200);

    await api
      .post('/api/activeSubject')
      .set('Cookie', [sessionId])
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      .send({ ...dummyActiveSubject, teacherId: teacher.body.userId })
      .expect(200);

    await api
      .delete(`${teacherRoute}${teacher.body.userId}`)
      .set('Cookie', [sessionId])
      .expect(200);
  });
});
