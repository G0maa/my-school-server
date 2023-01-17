/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import {
  createTeacher,
  deleteTeacher,
  getTeacher,
  getTeachers,
  updateTeacher,
} from '../services/teacher.service';
import { setAuthorizedRoles, isAuthenticated } from '../utils/middleware';
import { ZRole, ZUuid } from '../validator/general.validator';
import {
  ZTeacher,
  ZTeacherPut,
  ZTeacherQuery,
} from '../validator/teacher.validator';
import { ZUser, ZUserPut, ZUserQuery } from '../validator/user.validator';

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

// Erm... I can change the role to Admin.
// ORM doesn't care about patch or put, it's the same Model.set({}).
// Not tested
teacherRouter.put(
  '/:id',
  setAuthorizedRoles([ZRole.enum.Admin, ZRole.enum.Teacher]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const zUser = ZUserPut.parse({ ...req.body, id: req.params.id });
    const zTeacher = ZTeacherPut.parse({ ...req.body, userId: req.params.id });

    const teacher = await updateTeacher(zUser, zTeacher);

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
