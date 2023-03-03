import Holiday from '../models/holiday';
import {
  ZHolidayDelete,
  ZHolidayFind,
  ZHolidayPost,
} from '../validator/holiday.validator';

const getHolidays = async (query: ZHolidayFind['query']) => {
  const holidays = await Holiday.findAndCountAll({ ...query });
  return holidays;
};

const createHoliday = async (zHoliday: ZHolidayPost['body']) => {
  const holiday = await Holiday.create({ ...zHoliday });
  return holiday;
};

// There are no errors/messages given when you delete non-existent resource.
const deleteHoliday = async (serial: ZHolidayDelete['params']['serial']) => {
  const holiday = await Holiday.findOne({ where: { serial } });
  if (!holiday) return;
  await holiday.destroy();
  return;
};

export { getHolidays, createHoliday, deleteHoliday };
