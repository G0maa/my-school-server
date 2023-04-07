import supertest from 'supertest';
import { app } from '../app';
import Holiday from '../models/holiday';
import { ZHoliday } from '../validator/holiday.validator';
import { loginAdmin } from './helpers';

const api = supertest(app);
const holidayRoute = '/api/holiday';

let adminCookie: { Cookie: string };
beforeAll(async () => {
  adminCookie = await loginAdmin(api);
});

beforeEach(async () => {
  await Holiday.destroy({ where: {} });
});

const dummyHoliday: ZHoliday = {
  name: 'Victory of 6th of October',
  startDate: new Date('2023-10-06'),
  endDate: new Date('2023-10-06'),
};

describe('CRUD of Holiday', () => {
  test('POST & GET all Holidays', async () => {
    await api
      .post(holidayRoute)
      .set(adminCookie)
      .send(dummyHoliday)
      .expect(200);

    const holidays = await api.get(holidayRoute).set(adminCookie).expect(200);

    expect(holidays.body.rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          name: dummyHoliday.name,
        }),
      ])
    );
  });

  test('Delete a holiday', async () => {
    await Holiday.destroy({ where: {} });
    const holiday = await Holiday.create({ ...dummyHoliday });

    await api
      .delete(`${holidayRoute}/${holiday.serial}`)
      .set(adminCookie)
      .expect(200);

    const holidays = await api.get(holidayRoute).set(adminCookie).expect(200);

    expect(holidays.body).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          name: dummyHoliday.name,
        }),
      ])
    );
  });
});

describe('Pagination of Holidays', () => {
  test('Testing Pagination', async () => {
    for (let i = 0; i < 30; ++i) {
      await api
        .post(holidayRoute)
        .set(adminCookie)
        .send({ ...dummyHoliday, name: `test_${i}` })
        .expect(200);
    }

    const holidaysP1 = await api
      .get(`${holidayRoute}?page=1&size=10`)
      .set(adminCookie)
      .expect(200);

    const holidaysP2 = await api
      .get(`${holidayRoute}?page=2&size=10`)
      .set(adminCookie)
      .expect(200);

    expect(holidaysP1.body.count).toEqual(30);
    expect(holidaysP1.body.rows.length).toEqual(10);
    console.log('holidays.body', holidaysP1.body);

    // Veryifing order
    for (let i = 0; i < 10; ++i) {
      expect(holidaysP1.body.rows[i].name).toEqual(`test_${i}`);
      expect(holidaysP2.body.rows[i].name).toEqual(`test_${i + 10}`);
    }
  });
});
