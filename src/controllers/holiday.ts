/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import {
  createHoliday,
  deleteHoliday,
  getHolidays,
} from '../services/holiday.service';
import { setAuthorizedRoles, isAuthenticated } from '../utils/middleware';
import { ZRole } from '../validator/general.validator';
import { ZHoliday, ZHolidaySerial } from '../validator/holiday.validator';

const holidayRouter = express.Router();

// GET, POST, DELETE,
holidayRouter.get(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (_req, res) => {
    const holidays = await getHolidays();
    return res.status(200).json(holidays).end();
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
