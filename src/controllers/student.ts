/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import { Student, Var } from '../models';
import { Role } from '../types';
import { generateRandomPassword } from '../utils/helpers';
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
    const postStudent = PostStudent.parse(req.body);

    // Maybe bussiness logic, could be in /services
    // This integer value needs to get formatted
    const lastUsername = await Var.findOne({
      where: { varName: 'StudentUsername' },
    });

    if (!lastUsername) throw new Error('Post student error');
    postStudent.password = generateRandomPassword();

    const formatUsername = (lastValue: number) => {
      const temp = 'S0000';
      const trimmed = temp.slice(0, temp.length - lastValue.toString().length);
      return trimmed.concat(lastValue.toString());
    };

    postStudent.username = formatUsername(lastUsername.value);
    console.log('lastUsername', lastUsername);
    const query = Student.build({ postStudent });

    lastUsername.value += 1;
    await lastUsername.save();
    // await query.save();
    return res.status(200).json(query).end();
  }
);

export default studentRouter;
