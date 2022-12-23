/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import { Teacher, User } from '../models';
import { Role } from '../types';
import { setAuthorizedRoles, isAuthenticated } from '../utils/middleware';
import { PostFullTeacher, PostTeacher } from '../validator/teacher.validator';

const teacherRouter = express.Router();

// #17 very WET CRUD operations.
teacherRouter.get(
  '/',
  setAuthorizedRoles([Role.Admin]),
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
  setAuthorizedRoles([Role.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    if (req.query['type'] == 'full') {
      const postFullTeacher = PostFullTeacher.parse(req.body);

      const user = await User.create(postFullTeacher);
      await user.$create('teacher', {
        id: user.id,
        education: postFullTeacher.education,
        department: postFullTeacher.department,
      });

      return res.status(200).json(user).end();
    } else {
      // So, this validates for both User & Student.
      const postTeacher = PostTeacher.parse(req.body);

      // Then create each one separately.
      // You CANT do it vice versa, i.e. create Student then User.
      // Unless you can provide more parameters to sequelize hooks.
      const user = await User.create(postTeacher);
      await user.$create('teacher', { id: user.id });

      // 3rd one for actually giving student info to client.
      const student = await User.findOne({
        include: Teacher,
        where: { id: user.id },
      });
      return res.status(200).json(student).end();
    }
  }
);

export default teacherRouter;
