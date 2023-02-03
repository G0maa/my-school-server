/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
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
  validateSchema,
  isAuthenticatedTest,
} from '../utils/middleware';
import { ZRole, ZUuid } from '../validator/general.validator';
import {
  ZStudentPost,
  ZStudentPut,
  ZStudentQuery,
} from '../validator/student.validator';
import { ZUserQuery } from '../validator/user.validator';
import { ZUserDetailsQuery } from '../validator/userDetails.validator';

const studentRouter = express.Router();

studentRouter.get(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req, res) => {
    // Can this look better? To-Do
    const searchQueryUser = ZUserQuery.parse(req.query);
    const searchQueryUserDetails = ZUserDetailsQuery.parse(req.query);
    const searchQueryStudent = ZStudentQuery.parse(req.query);

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
  const zUuid = ZUuid.parse(req.params.id);
  const student = await getUser(zUuid, 'Student');
  return res.status(200).json(student).end();
});

studentRouter.post(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin, ZRole.enum.Student]),
  isAuthenticatedTest('id'),
  validateSchema(ZStudentPost),
  async (req: Request<object, object, ZStudentPost['body']>, res: Response) => {
    const { user, userDetails, student } = req.body;

    const newStudent = await createUser(user, userDetails, student);

    return res.status(200).json(newStudent).end();
  }
);

// Not tested
studentRouter.put(
  '/:id',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  validateSchema(ZStudentPut),
  async (
    req: Request<ZStudentPut['params'], object, ZStudentPut['body']>,
    res: Response
  ) => {
    const userId = req.params.id;
    const { user, userDetails, student } = req.body;

    const newStudent = await updateUser(userId, user, userDetails, student);

    return res.status(200).json(newStudent).end();
  }
);

studentRouter.delete(
  '/:id',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const zUuid = ZUuid.parse(req.params.id);
    const deletedStudent = await deleteUser(zUuid, 'Student');
    return res.status(200).json(deletedStudent).end();
  }
);

export default studentRouter;
