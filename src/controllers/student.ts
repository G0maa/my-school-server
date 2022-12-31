/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import {
  createStudent,
  deleteStudent,
  getStudent,
  getStudents,
} from '../services/student.service';
import { setAuthorizedRoles, isAuthenticated } from '../utils/middleware';
import { ZRole, ZUuid } from '../validator/general.validator';
import { ZStudent, ZStudentQuery } from '../validator/student.validator';
import { ZUser, ZUserQuery } from '../validator/user.validator';

const studentRouter = express.Router();

// GET, GET:id, POST, DELETE, PUT
studentRouter.get(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req, res) => {
    const searchQueryUser = ZUserQuery.parse(req.query);
    const searchQueryStudent = ZStudentQuery.parse(req.query);
    const allStudents = await getStudents(searchQueryUser, searchQueryStudent);
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
  async (req: Request, res: Response) => {
    const zUser = ZUser.parse(req.body);
    const zStudent = ZStudent.parse(req.body);

    const newStudent = await createStudent(zUser, zStudent);

    return res.status(200).json(newStudent).end();
  }
);

studentRouter.delete(
  '/:id',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const zUuid = ZUuid.parse(req.params.id);
    const deletedStudent = await deleteStudent(zUuid);
    return res.status(200).json(deletedStudent).end();
  }
);

export default studentRouter;
