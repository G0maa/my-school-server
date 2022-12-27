/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import { Teacher, User } from '../models';
import { setAuthorizedRoles, isAuthenticated } from '../utils/middleware';
import { ZRole } from '../validator/general.validator';
import { ZTeacher } from '../validator/teacher.validator';
import { ZUser } from '../validator/user.validator';

const teacherRouter = express.Router();

// #17 very WET CRUD operations.
teacherRouter.get(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (_req, res) => {
    const query = await Teacher.findAll();
    return res.status(200).json(query).end();
  }
);

teacherRouter.get('/:id', isAuthenticated, async (req, res) => {
  const query = await Teacher.findOne({
    include: User,
    where: { userId: req.params.id },
  });
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

    zUser.role = 'Teacher';

    const teacher = await Teacher.create(
      {
        ...zTeacher,
        user: { ...zUser },
      },
      {
        include: User,
      }
    );

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
    const teacher = await Teacher.destroy({ where: { userId: req.params.id } });
    return res.status(200).json(teacher).end();
  }
);

export default teacherRouter;
