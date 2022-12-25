import supertest from 'supertest';
import { app } from '../app';
import { ZStudent, ZUser } from '../validator/student.validator';
import { loginAdmin } from './helpers';

const api = supertest(app);
const studentRoute = '/api/student/';

let sessionId: string;
beforeAll(async () => {
  sessionId = (await loginAdmin(api)) as string;
  // Can be moved to its own function
  await api.get('/testAuth').set('Cookie', [sessionId]).expect(200);
});

// must not provide username & password as they're auto created.
const dummyStudent: ZStudent = {
  class: '1',
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
  class: '1',
  educationType: 'Sceiences',
  parentName: 'Gomaa',
  parentPhonenumber: 'Mohammed',
} as ZStudent & ZUser;

describe('CRUD of Student', () => {
  test('POST & GET simpleified student', async () => {
    // const postStudent = await api

    await api
      .post(studentRoute)
      .set('Cookie', [sessionId])
      .send(dummyStudent)
      .expect(200);

    const res = await api
      .post(studentRoute)
      .set('Cookie', [sessionId])
      .send(dummyStudent)
      .expect(200);

    const get = await api
      .get(`${studentRoute}${res.body.id}`)
      .set('Cookie', [sessionId])
      .expect(200);

    expect(get.body.user.role).toMatch('Student');
    expect(get.body.user.username).toEqual('S0003');
  });

  test('POST & GET full student', async () => {
    const res = await api
      .post(`${studentRoute}?type=full`)
      .set('Cookie', [sessionId])
      .send(fullStudent)
      .expect(200);

    await api
      .get(`${studentRoute}${res.body.id}`)
      .set('Cookie', [sessionId])
      .expect(200);
  });
});
