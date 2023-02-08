/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from '../services/user.service';
import {
  setAuthorizedRoles,
  isAuthenticated,
  isAuthenticatedTest,
} from '../utils/middleware';
import { ZRole } from '../validator/general.validator';
import {
  ZTeacherFind,
  ZTeacherPost,
  ZTeacherPut,
  ZTeacherQuery,
} from '../validator/teacher.validator';
import {
  ZUserDelete,
  ZUserGetOne,
  ZUserQuery,
} from '../validator/user.validator';
import { ZUserDetailsQuery } from '../validator/userDetails.validator';

const teacherRouter = express.Router();

teacherRouter.get(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req, res) => {
    const { query } = ZTeacherFind.parse(req);

    const searchQueryUser = ZUserQuery.parse(query);
    const searchQueryUserDetails = ZUserDetailsQuery.parse(query);
    const searchQueryTeacher = ZTeacherQuery.parse(query);

    const queryResult = await getUsers(
      'Teacher',
      searchQueryUser,
      searchQueryUserDetails,
      searchQueryTeacher
    );
    return res.status(200).json(queryResult).end();
  }
);

teacherRouter.get('/:id', isAuthenticated, async (req, res) => {
  const { params } = ZUserGetOne.parse(req);

  const query = await getUser(params.id, 'Teacher');

  return res.status(200).json(query).end();
});

teacherRouter.post(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req, res) => {
    const { body } = ZTeacherPost.parse(req);

    const user = { ...body, userDetails: undefined, teacher: undefined };

    const newTeacher = await createUser(user, body.userDetails, body.teacher);

    return res.status(200).json(newTeacher).end();
  }
);

teacherRouter.put(
  '/:id',
  setAuthorizedRoles([ZRole.enum.Admin, ZRole.enum.Teacher]),
  isAuthenticatedTest('id'),
  async (req, res) => {
    const { params, body } = ZTeacherPut.parse(req);

    // To-Do: This is kind of too hacky.
    const user = { ...body, userDetails: undefined, teacher: undefined };

    const newTeacher = await updateUser(
      params.id,
      user,
      body.userDetails,
      body.teacher
    );

    console.log('newTeacher', newTeacher);
    return res.status(200).json(newTeacher).end();
  }
);

teacherRouter.delete(
  '/:id',
  setAuthorizedRoles([ZRole.Enum.Admin]),
  isAuthenticated,
  async (req, res) => {
    const { params } = ZUserDelete.parse(req);

    const teacher = await deleteUser(params.id, 'Teacher');

    return res.status(200).json(teacher).end();
  }
);

export default teacherRouter;
