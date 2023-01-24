import supertest from 'supertest';
import { app } from '../app';
import { ZTeacherPost } from '../validator/teacher.validator';
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
    registerDate: new Date('2022-12-16'),
    dateOfBirth: new Date('1995-01-01'),
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
      .set('Cookie', [sessionId])
      .send(dummyTeacher)
      .expect(200);

    const res = await api
      .post(teacherRoute)
      .set('Cookie', [sessionId])
      .send(dummyTeacher)
      .expect(200);

    const get = await api
      .get(`${teacherRoute}${res.body.id}`)
      .set('Cookie', [sessionId])
      .expect(200);

    expect(get.body.user.role).toEqual('Teacher');
    expect(get.body.user.username).toMatch('T');
  });

  test('POST & GET full teacher', async () => {
    const res = await api
      .post(teacherRoute)
      .set('Cookie', [sessionId])
      .send(fullTeacher)
      .expect(200);

    const newTeacher = await api
      .get(`${teacherRoute}${res.body.id}`)
      .set('Cookie', [sessionId])
      .expect(200);

    expect(newTeacher.body.department).toEqual(fullTeacher.teacher.department);
    expect(newTeacher.body.user.email).toEqual(fullTeacher.user.email);
    expect(newTeacher.body.user.userDetails.bloodGroup).toEqual(
      fullTeacher.userDetails.bloodGroup
    );
  });

  test('Success delete Teacher when theres no Referrenetial Integerity', async () => {
    const teacher = await api
      .post(teacherRoute)
      .set('Cookie', [sessionId])
      .send(dummyTeacher)
      .expect(200);

    await api
      .delete(`${teacherRoute}${teacher.body.id}`)
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
      .send({ ...dummyActiveSubject, teacherId: teacher.body.id })
      .expect(200);

    await api
      .delete(`${teacherRoute}${teacher.body.id}`)
      .set('Cookie', [sessionId])
      .expect(200);
  });
});
