/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import { getStudent, getStudents } from '../services/student.service';
import { createUser, deleteUser, updateUser } from '../services/user.service';
import {
  setAuthorizedRoles,
  isAuthenticated,
  validateSchema,
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

// GET, GET:id, POST, DELETE, PUT
studentRouter.get(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req, res) => {
    const searchQueryUser = ZUserQuery.parse(req.query);
    const searchQueryUserDetails = ZUserDetailsQuery.parse(req.body);
    const searchQueryStudent = ZStudentQuery.parse(req.query);

    const allStudents = await getStudents(
      searchQueryUser,
      searchQueryUserDetails,
      searchQueryStudent
    );
    return res.status(200).json(allStudents).end();
  }
);

studentRouter.get('/:id', isAuthenticated, async (req, res) => {
  const zUuid = ZUuid.parse(req.params.id);
  const student = await getStudent(zUuid);
  return res.status(200).json(student).end();
});

studentRouter.post(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
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
