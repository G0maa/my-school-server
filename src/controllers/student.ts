/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import { Student, User } from '../models';
import { Role } from '../types';
// import { generateRandomPassword } from '../utils/helpers';
import { setAuthorizedRoles, isAuthenticated } from '../utils/middleware';
import { PostStudent } from '../validator/student.validator';

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
  const query = await Student.findOne({ where: { id: req.params.id } });
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
      return res.status(200).json({}).end();
    } else {
      const postStudent = PostStudent.parse(req.body);
      const student = await User.create(postStudent);
      console.log('postministudent', student);
    }
    return res.status(200).json({}).end();
  }
);

export default studentRouter;
