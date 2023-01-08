import supertest from 'supertest';
import { app } from '../app';
import Holiday from '../models/holiday';
import { ZHoliday } from '../validator/holiday.validator';
import { getAdminCredentialsHeader } from './helpers';

const api = supertest(app);
const holidayRoute = '/api/holiday/';

let adminHeader: object;
beforeAll(async () => {
  adminHeader = await getAdminCredentialsHeader(api, true);
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
      .set(adminHeader)
      .send(dummyHoliday)
      .expect(200);

    const holidays = await api.get(holidayRoute).set(adminHeader).expect(200);

    expect(holidays.body).toEqual(
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
      .delete(`${holidayRoute}${holiday.serial}`)
      .set(adminHeader)
      .expect(200);

    const holidays = await api.get(holidayRoute).set(adminHeader).expect(200);

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
