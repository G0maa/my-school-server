/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import {
  createTeacher,
  deleteTeacher,
  getTeacher,
  getTeachers,
} from '../services/teacher.service';
import { setAuthorizedRoles, isAuthenticated } from '../utils/middleware';
import { ZRole, ZUuid } from '../validator/general.validator';
import { ZTeacher, ZTeacherQuery } from '../validator/teacher.validator';
import { ZUser, ZUserQuery } from '../validator/user.validator';

const teacherRouter = express.Router();

// #17 very WET CRUD operations.
teacherRouter.get(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req, res) => {
    const searchQueryUser = ZUserQuery.parse(req.query);
    const searchQueryTeacher = ZTeacherQuery.parse(req.query);

    const query = await getTeachers(searchQueryUser, searchQueryTeacher);
    return res.status(200).json(query).end();
  }
);

teacherRouter.get('/:id', isAuthenticated, async (req, res) => {
  const zUuid = ZUuid.parse(req.params.id);
  const query = await getTeacher(zUuid);
  return res.status(200).json(query).end();
});

// Remains for Teacher: doing this the correct way.
teacherRouter.post(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const zUser = ZUser.parse(req.body);
    const zTeacher = ZTeacher.parse(req.body);

    const teacher = await createTeacher(zUser, zTeacher);

    return res.status(200).json(teacher).end();
  }
);

// Deletion in an School System might be tricky,
// i.e. this teacher might be in some record in ActiveCourses.
// current implementation => Don't delete and give a not so useful error message.
teacherRouter.delete(
  '/:id',
  setAuthorizedRoles([ZRole.Enum.Admin]),
  isAuthenticated,
  async (req, res) => {
    const zUuid = ZUuid.parse(req.params.id);
    const teacher = await deleteTeacher(zUuid);
    return res.status(200).json(teacher).end();
  }
);

export default teacherRouter;
