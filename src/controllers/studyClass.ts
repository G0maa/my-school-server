/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import {
  createStudyClass,
  deleteStudyClass,
  getStudyClass,
  getStudyClasses,
} from '../services/studyClass.service';
import { setAuthorizedRoles, isAuthenticated } from '../utils/middleware';
import { ZRole } from '../validator/general.validator';
import {
  ZStudyClass,
  ZStudyClassQuery,
} from '../validator/studyClass.validator';

const studyClassRouter = express.Router();

// #17 very WET CRUD operations.
studyClassRouter.get(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin, ZRole.enum.Student]),
  isAuthenticated,
  async (req, res) => {
    const searchQuery = ZStudyClassQuery.parse(req.query);
    const query = await getStudyClasses(searchQuery);
    return res.status(200).json(query).end();
  }
);

studyClassRouter.get('/:id', isAuthenticated, async (req, res) => {
  const zStudyClassId = ZStudyClass.shape.classId.parse(req.params.id);
  const query = await getStudyClass(zStudyClassId);
  return res.status(200).json(query).end();
});

studyClassRouter.post(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const zStudyClass = ZStudyClass.parse(req.body);
    const studyClass = await createStudyClass(zStudyClass);
    return res.status(200).json(studyClass).end();
  }
);

// Not tested
studyClassRouter.delete(
  '/:id',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const zStudyClassId = ZStudyClass.shape.classId.parse(req.params.id);

    const studyClass = await deleteStudyClass(zStudyClassId);
    return res.status(200).json(studyClass).end();
  }
);

export default studyClassRouter;
