import supertest from 'supertest';
import { app } from '../app';
import { getDummyStudent, loginAdmin } from './helpers';

const api = supertest(app);
const feeRoute = '/api/fee';

let sessionId: string;
beforeAll(async () => {
  // P.S: Can be a student too, something code coverage won't get.
  sessionId = (await loginAdmin(api)) as string;
  await api.get('/testAuth').set('Cookie', [sessionId]).expect(200);
});

// can't assign type cuz of dueDate, has to be new Date('2023-01-18')...
export const dummyFee = {
  studentId: 'BSC123', // Wrong
  feeType: 'Tuituiotion',
  amount: 500,
  dueDate: '2023-01-18',
};

describe('CRUD of Fee', () => {
  test('POST & GET Fee', async () => {
    const dummyStudent = await getDummyStudent();

    dummyFee.studentId = dummyStudent.userId;

    const fee = await api
      .post(feeRoute)
      .set('Cookie', [sessionId])
      .send(dummyFee)
      .expect(200);

    const get = await api
      .get(`${feeRoute}/${fee.body.serial}`)
      .set('Cookie', [sessionId])
      .expect(200);

    expect(get.body).toMatchObject(dummyFee);
  });
});
