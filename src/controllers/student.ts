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
  setAuthorizedRoles([ZRole.Enum.Admin]),
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
  setAuthorizedRoles([ZRole.Enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    // Caveat: Can't set a default role for user now..
    const zUser = ZUser.parse(req.body);
    const zStudent = ZStudent.parse(req.body);

    const user = await User.create(
      {
        ...zUser,
        role: ZRole.Enum.Student, // is there antoher way to set this?
        student: { ...zStudent },
      },
      {
        include: Student,
      }
    );

    return res.status(200).json(user).end();
  }
);

export default studentRouter;
