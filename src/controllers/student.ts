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
  ZStudentFind,
  ZStudentPost,
  ZStudentPut,
  ZStudentQuery,
} from '../validator/student.validator';
import {
  ZUserDelete,
  ZUserGetOne,
  ZUserQuery,
} from '../validator/user.validator';
import { ZUserDetailsQuery } from '../validator/userDetails.validator';

const studentRouter = express.Router();

studentRouter.get(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req, res) => {
    // Validating twice, can it be better? To-Do
    const { query } = ZStudentFind.parse(req);

    const searchQueryUser = ZUserQuery.parse(query);
    const searchQueryUserDetails = ZUserDetailsQuery.parse(query);
    const searchQueryStudent = ZStudentQuery.parse(query);

    const allStudents = await getUsers(
      'Student',
      searchQueryUser,
      searchQueryUserDetails,
      searchQueryStudent
    );

    return res.status(200).json(allStudents).end();
  }
);

studentRouter.get('/:id', isAuthenticated, async (req, res) => {
  const { params } = ZUserGetOne.parse(req);

  const student = await getUser(params.id, 'Student');

  return res.status(200).json(student).end();
});

studentRouter.post(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticatedTest('id'),
  async (req, res) => {
    const { body } = ZStudentPost.parse(req);

    const user = { ...body, userDetails: undefined, student: undefined };

    const newStudent = await createUser(user, body.userDetails, body.student);

    return res.status(200).json(newStudent).end();
  }
);

// Not tested
studentRouter.put(
  '/:id',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req, res) => {
    const { params, body } = ZStudentPut.parse(req);

    const user = { ...body, userDetails: undefined, student: undefined };

    const newStudent = await updateUser(
      params.id,
      user,
      body.userDetails,
      body.student
    );

    return res.status(200).json(newStudent).end();
  }
);

studentRouter.delete(
  '/:id',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req, res) => {
    const { params } = ZUserDelete.parse(req);

    const deletedStudent = await deleteUser(params.id, 'Student');

    return res.status(200).json(deletedStudent).end();
  }
);

export default studentRouter;
