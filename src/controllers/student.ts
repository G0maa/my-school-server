/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import { Student, User } from '../models';
import { setAuthorizedRoles, isAuthenticated } from '../utils/middleware';
import { ZRole } from '../validator/general.validator';
import { ZStudent } from '../validator/student.validator';
import { ZUser } from '../validator/user.validator';

const studentRouter = express.Router();

// GET, GET:id, POST, DELETE, PUT
studentRouter.get(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (_req, res) => {
    const query = await Student.findAll();
    return res.status(200).json(query).end();
  }
);

studentRouter.get('/:id', isAuthenticated, async (req, res) => {
  const query = await Student.findOne({
    include: User,
    where: { userId: req.params.id },
  });
  return res.status(200).json(query).end();
});

// Very broken route, will fix eventually.
studentRouter.post(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const zUser = ZUser.parse(req.body);
    const zStudent = ZStudent.parse(req.body);

    // Caveat: Can't set a default role for user now..
    zUser.role = 'Student';

    const student = await Student.create(
      {
        ...zStudent,
        user: { ...zUser },
      },
      {
        include: User,
      }
    );

    return res.status(200).json(student).end();
  }
);

// To-do Delete student , test with classId existing, add classId to Validator
// test that classId actually references an actualy studyClass, etc...
studentRouter.delete(
  '/:id',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const student = await Student.destroy({ where: { userId: req.params.id } });
    return res.status(200).json(student).end();
  }
);

export default studentRouter;
