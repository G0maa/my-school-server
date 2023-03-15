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
  ZGradeDelete,
  ZGradeFind,
  ZGradeGet,
  ZGradePost,
  ZGradePut,
} from '../validator/grade.validator';

const gradeRouter = express.Router();

gradeRouter.get('/', isAuthenticated, async (req, res) => {
  /* 
      #swagger.tags = ['Grades']
      #swagger.security = [{ "cookieAuth": [] }]
  */
  const { query, user } = ZGradeFind.parse(req);

  const grades = await getGrades(query, user);

  return res.status(200).json(grades).end();
});

// This route doesn't support Teacher requests.
// i.e. a Teacher can't /api/grade/:serial
// will always return not found, probably unreasonable.
gradeRouter.get('/:serial', isAuthenticated, async (req, res) => {
  /* 
    #swagger.tags = ['Grades']
    #swagger.security = [{ "cookieAuth": [] }]
  */
  const { params, user } = ZGradeGet.parse(req);

  const grade = await getGrade(params.serial, user);

  if (!grade) return res.status(404).json({ message: 'Fee not found' }).end();

  return res.status(200).json(grade).end();
});

gradeRouter.post(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin, ZRole.enum.Teacher]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    /* 
      #swagger.tags = ['Grades']
      #swagger.security = [{ "cookieAuth": [] }]
    */
    const { body } = ZGradePost.parse(req);

    const grade = await addGrade(body);

    return res.status(200).json(grade).end();
  }
);

// not-tested
gradeRouter.put(
  '/:id',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    /* 
      #swagger.tags = ['Grades']
      #swagger.security = [{ "cookieAuth": [] }]
    */
    const { params, body } = ZGradePut.parse(req);

    const grade = await updateGrade({ ...body, serial: params.serial });

    return res.status(200).json(grade).end();
  }
);

gradeRouter.delete(
  '/:serial',
  setAuthorizedRoles([ZRole.enum.Admin, ZRole.enum.Teacher]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    /* 
      #swagger.tags = ['Grades']
      #swagger.security = [{ "cookieAuth": [] }]
    */
    const { params } = ZGradeDelete.parse(req);

    const grade = await deleteGrade(params.serial);

    return res.status(200).json(grade).end();
  }
);
export default gradeRouter;
