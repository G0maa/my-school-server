/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import { getTeacher, getTeachers } from '../services/teacher.service';
import { createUser, deleteUser, updateUser } from '../services/user.service';
import {
  setAuthorizedRoles,
  isAuthenticated,
  validateSchema,
} from '../utils/middleware';
import { ZRole, ZUuid } from '../validator/general.validator';
import {
  ZTeacherPost,
  ZTeacherPut,
  ZTeacherQuery,
} from '../validator/teacher.validator';
import { ZUserQuery } from '../validator/user.validator';

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

teacherRouter.post(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  validateSchema(ZTeacherPost),
  async (req: Request<object, object, ZTeacherPost['body']>, res: Response) => {
    const { user, userDetails, teacher } = req.body;

    const newTeacher = await createUser(user, userDetails, teacher);

    return res.status(200).json(newTeacher).end();
  }
);

// Erm... I can change the role to Admin.
// ORM doesn't care about patch or put, it's the same Model.set({}).
// Not tested
teacherRouter.put(
  '/:id',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  validateSchema(ZTeacherPut),
  async (
    req: Request<ZTeacherPut['params'], object, ZTeacherPut['body']>,
    res: Response
  ) => {
    const userId = req.params.id;
    const { user, userDetails, teacher } = req.body;

    const newTeacher = await updateUser(userId, user, userDetails, teacher);

    return res.status(200).json(newTeacher).end();
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
    const teacher = await deleteUser(zUuid, 'Teacher');
    return res.status(200).json(teacher).end();
  }
);

export default teacherRouter;
