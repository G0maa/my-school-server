import Holiday from '../models/holiday';
import {
  ZHoliday,
  ZHolidayPut,
  ZHolidaySerial,
} from '../validator/holiday.validator';

const getHolidays = async () => {
  const holidays = await Holiday.findAll();
  return holidays;
};

const getHoliday = async (serial: ZHolidaySerial) => {
  const holiday = await Holiday.findOne({ where: { serial } });
  if (!holiday) return;
  return holiday;
};

const createHoliday = async (zHoliday: ZHoliday) => {
  const holiday = await Holiday.create({ ...zHoliday });
  return holiday;
};

const editHoliday = async (zHoliday: ZHolidayPut) => {
  const holiday = await Holiday.findOne({ where: { serial: zHoliday.serial } });

  if (!holiday) return;

  holiday.set({ ...zHoliday });
  await holiday.save();

  return holiday;
};

// There are no errors/messages given when you delete non-existent resource.
const deleteHoliday = async (serial: ZHolidaySerial) => {
  const holiday = await Holiday.findOne({ where: { serial } });
  if (!holiday) return;
  await holiday.destroy();
  return;
};

export { getHolidays, getHoliday, editHoliday, createHoliday, deleteHoliday };
