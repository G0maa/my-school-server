/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import {
  createHoliday,
  deleteHoliday,
  editHoliday,
  getHoliday,
  getHolidays,
} from '../services/holiday.service';
import { setAuthorizedRoles, isAuthenticated } from '../utils/middleware';
import { ZRole } from '../validator/general.validator';
import {
  ZHoliday,
  ZHolidayPut,
  ZHolidaySerial,
} from '../validator/holiday.validator';

const holidayRouter = express.Router();

// GET, GET:serial, POST, PUT, DELETE,
holidayRouter.get('/', isAuthenticated, async (_req, res) => {
  const holidays = await getHolidays();
  return res.status(200).json(holidays).end();
});

holidayRouter.get(
  '/:serial',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const zHolidaySerial = ZHolidaySerial.parse(req.params.serial);

    const holiday = await getHoliday(zHolidaySerial);
    return res.status(200).json(holiday).end();
  }
);

holidayRouter.post(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const zHoliday = ZHoliday.parse(req.body);

    const holiday = await createHoliday(zHoliday);

    return res.status(200).json(holiday).end();
  }
);

// Not tested.
holidayRouter.put(
  '/:serial',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const zHoliday = ZHolidayPut.parse({
      ...req.body,
      serial: req.params.serial,
    });

    const holiday = await editHoliday(zHoliday);

    return res.status(200).json(holiday).end();
  }
);

holidayRouter.delete(
  '/:serial',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const zHolidaySerial = ZHolidaySerial.parse(req.params.serial);
    const deletedHoliday = await deleteHoliday(zHolidaySerial);
    return res.status(200).json(deletedHoliday).end();
  }
);

export default holidayRouter;
