/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import { Student, User } from '../models';
import { Role } from '../types';
import { setAuthorizedRoles, isAuthenticated } from '../utils/middleware';
import { ZStudent, ZUser } from '../validator/student.validator';

const studentRouter = express.Router();

// GET, GET:id, POST, DELETE, PUT
studentRouter.get(
  '/',
  setAuthorizedRoles([Role.Admin]),
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
  setAuthorizedRoles([Role.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    // Caveat: Can't set a default role for user now..
    const zUser = ZUser.parse(req.body);
    const zStudent = ZStudent.parse(req.body);

    // const user = await User.create({ ...zUser, role: Roles.enum.Student });
    // await user.$create('student', zStudent);

    const student = await User.create(
      {
        ...zUser,
        role: Role.Student,
        student: { ...zStudent },
      },
      {
        include: Student,
      }
    );

    // 3rd one for actually giving student info to client.
    // #fix... was that ever needed?
    // const student = await User.findOne({
    //   include: Student,
    //   where: { id: user.id },
    // });
    return res.status(200).json(student).end();
  }
);

export default studentRouter;
