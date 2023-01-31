import supertest from 'supertest';
import { app } from '../app';
import { getDummyFee, getDummyStudent, loginAdmin } from './helpers';

const api = supertest(app);
const feeRoute = '/api/fee';

let adminCookie: { Cookie: string };
beforeAll(async () => {
  // P.S: Can be a student too, something code coverage won't get.
  adminCookie = await loginAdmin(api);
});

// can't assign type cuz of dueDate, has to be new Date('2023-01-18')...
export const dummyFee = {
  studentId: 'BSC123', // Wrong
  feeType: 'Tuituiotion',
  amount: 500,
  dueDate: '2023-01-18',
};

describe('CRUD of Fee', () => {
  test('POST & GET Fee (admin)', async () => {
    const { id } = await getDummyStudent();

    // Setting correct studentId in dummyFe
    dummyFee.studentId = id;

    const fee = await api
      .post(feeRoute)
      .set(adminCookie)
      .send(dummyFee)
      .expect(200);

    const get = await api
      .get(`${feeRoute}/${fee.body.serial}`)
      .set(adminCookie)
      .expect(200);

    expect(get.body).toMatchObject(dummyFee);
  });
});

describe('Security of Fees API', () => {
  test('Student can access his own fees', async () => {
    const { id, username, password } = await getDummyStudent();
    const studentCookie = await loginAdmin(api, { username, password });

    const testFee = { ...dummyFee, studentId: id };

    const fee = await api
      .post(feeRoute)
      .set(adminCookie)
      .send(testFee)
      .expect(200);

    const get = await api
      .get(`${feeRoute}/${fee.body.serial}?studentId=${id}`)
      .set(studentCookie)
      .expect(200);

    expect(get.body).toMatchObject(testFee);
  });

  test('Student cannot access other students fees', async () => {
    const { username, password } = await getDummyStudent();
    const studentCookie = await loginAdmin(api, { username, password });

    const testFee = await getDummyFee();

    const get = await api
      .get(`${feeRoute}/${testFee.serial}`)
      .set(studentCookie)
      .expect(404);

    expect(get.body).toEqual({ message: 'Fee not found' });
  });
});
