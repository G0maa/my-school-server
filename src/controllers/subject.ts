/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import Subject from '../models/subject';
import { Role } from '../types';
import { setAuthorizedRoles, isAuthenticated } from '../utils/middleware';
import { PostSubject } from '../validator/subject.validator';

const subjectRouter = express.Router();

// #17 very WET CRUD operations.
subjectRouter.get(
  '/',
  setAuthorizedRoles([Role.Admin, Role.Student]),
  isAuthenticated,
  async (_req, res) => {
    const query = await Subject.findAll();
    return res.status(200).json(query).end();
  }
);

subjectRouter.get('/:id', isAuthenticated, async (req, res) => {
  const query = await Subject.findOne({
    where: { subjectId: req.params.id },
  });
  return res.status(200).json(query).end();
});

subjectRouter.post(
  '/',
  setAuthorizedRoles([Role.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const postSubject = PostSubject.parse(req.body);
    const subject = await Subject.create(postSubject);
    return res.status(200).json(subject).end();
  }
);

export default subjectRouter;
