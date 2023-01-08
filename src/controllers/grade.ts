/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import {
  addGrade,
  deleteGrade,
  getGrade,
  getGrades,
  updateGrade,
} from '../services/grade.service';
import { setAuthorizedRoles, isAuthenticated } from '../utils/middleware';
import { ZRole } from '../validator/general.validator';
import {
  ZGrade,
  ZGradeFind,
  ZGradePut,
  ZGradeSerial,
} from '../validator/grade.validator';

const gradeRouter = express.Router();

// POST /
// PUT / /:serial
// DELETE /:serial
// To-Do apply proper authentication here.
gradeRouter.get('/', isAuthenticated, async (req, res) => {
  const searchQuery = ZGradeFind.parse(req.query);
  const query = await getGrades(searchQuery);
  return res.status(200).json(query).end();
});

gradeRouter.get('/:serial', isAuthenticated, async (req, res) => {
  const zSerial = ZGradeSerial.parse(req.params.serial);
  const query = await getGrade(zSerial);
  return res.status(200).json(query).end();
});

gradeRouter.post(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin, ZRole.enum.Teacher]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const zGrade = ZGrade.parse(req.body);
    const grade = await addGrade(zGrade);
    return res.status(200).json(grade).end();
  }
);

// not-tested
gradeRouter.put(
  '/:id',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const zGrade = ZGradePut.parse({
      ...req.body,
      serial: req.params.id,
    });
    const grade = await updateGrade(zGrade);
    return res.status(200).json(grade).end();
  }
);

gradeRouter.delete(
  '/:serial',
  setAuthorizedRoles([ZRole.enum.Admin, ZRole.enum.Teacher]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const zSerial = ZGradeSerial.parse(req.params.id);
    const grade = await deleteGrade(zSerial);
    return res.status(200).json(grade).end();
  }
);
export default gradeRouter;
