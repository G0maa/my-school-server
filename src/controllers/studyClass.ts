/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import StudyClass from '../models/class';
import { setAuthorizedRoles, isAuthenticated } from '../utils/middleware';
import { ZRole } from '../validator/general.validator';
import { ZStudyClass } from '../validator/studyClass.validator';

const studyClassRouter = express.Router();

// #17 very WET CRUD operations.
studyClassRouter.get(
  '/',
  setAuthorizedRoles([ZRole.Enum.Admin, ZRole.Enum.Student]),
  isAuthenticated,
  async (_req, res) => {
    const query = await StudyClass.findAll();
    return res.status(200).json(query).end();
  }
);

studyClassRouter.get('/:id', isAuthenticated, async (req, res) => {
  const query = await StudyClass.findOne({
    where: { classId: req.params.id },
  });
  return res.status(200).json(query).end();
});

studyClassRouter.post(
  '/',
  setAuthorizedRoles([ZRole.Enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const zStudyClass = ZStudyClass.parse(req.body);
    const studyClass = await StudyClass.create(zStudyClass);
    return res.status(200).json(studyClass).end();
  }
);

export default studyClassRouter;
