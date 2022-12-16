/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import { Student, User } from '../models';
import { Role } from '../types';
// import { generateRandomPassword } from '../utils/helpers';
import { setAuthorizedRoles, isAuthenticated } from '../utils/middleware';
import { PostFullStudent, PostStudent } from '../validator/student.validator';

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
  const query = await Student.findOne({ where: { userId: req.params.id } });
  return res.status(200).json(query).end();
});

// Very broken route, will fix eventually.
studentRouter.post(
  '/',
  setAuthorizedRoles([Role.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    // const [name, studentClass, parentName, parentPhonenumber] = req.body;
    if (req.query['type'] == 'full') {
      const postFullStudent = PostFullStudent.parse(req.body);

      const user = await User.create(postFullStudent);
      await user.$create('student', {
        id: user.id,
        class: postFullStudent.class,
        role: postFullStudent.role,
        educationType: postFullStudent.educationType,
        parentName: postFullStudent.parentName,
        parentPhonenumber: postFullStudent.parentPhonenumber,
      });

      return res.status(200).json(user).end();
    } else {
      // So, this validates for both User & Student.
      const postStudent = PostStudent.parse(req.body);

      // Then create each one separately.
      // You CANT do it vice versa, i.e. create Student then User.
      // Unless you can provide more parameters to sequelize hooks.
      const user = await User.create(postStudent);
      await user.$create('student', { id: user.id, class: postStudent.class });

      // 3rd one for actually giving student info to client.
      const student = await User.findOne({
        include: Student,
        where: { id: user.id },
      });
      return res.status(200).json(student).end();
    }
  }
);

export default studentRouter;
