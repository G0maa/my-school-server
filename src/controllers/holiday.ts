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
import {
  ZHolidayPost,
  ZHolidayDelete,
  ZHolidayFind,
} from '../validator/holiday.validator';

const holidayRouter = express.Router();

holidayRouter.get('/', isAuthenticated, async (req, res) => {
  /* 
    #swagger.tags = ['Holidays']
    #swagger.security = [{ "cookieAuth": [] }]
  */
  const { query } = ZHolidayFind.parse(req);
  const holidays = await getHolidays(query);

  return res.status(200).json(holidays).end();
});

holidayRouter.post(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    /* 
      #swagger.tags = ['Holidays']
      #swagger.security = [{ "cookieAuth": [] }]
    */
    const { body } = ZHolidayPost.parse(req);

    const holiday = await createHoliday(body);

    return res.status(200).json(holiday).end();
  }
);

holidayRouter.delete(
  '/:serial',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    /* 
      #swagger.tags = ['Holidays']
      #swagger.security = [{ "cookieAuth": [] }]
    */
    const { params } = ZHolidayDelete.parse(req);

    const deletedHoliday = await deleteHoliday(params.serial);

    return res.status(200).json(deletedHoliday).end();
  }
);

export default holidayRouter;
