/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import ActiveSubject from '../models/activeSubject';
import { Role } from '../types';
import { setAuthorizedRoles, isAuthenticated } from '../utils/middleware';
import { PostActiveSubject } from '../validator/activeSubject.validator';

const activeSubjectRouter = express.Router();

// #17 very WET CRUD operations.
activeSubjectRouter.get(
  '/',
  setAuthorizedRoles([Role.Admin]),
  isAuthenticated,
  async (_req, res) => {
    const query = await ActiveSubject.findAll();
    return res.status(200).json(query).end();
  }
);

// Lots of variations in this one.
// To-Do
// /api/activeSubjects/:id?query=teacher i.e. all classes & subjects for this teacher id
// /api/activeSubjects/:id?query=studyClass i.e. all subjects & teachers for this class
// /api/activeSubjects/:id?query=subject i.e. all classes & teachers for this subject
activeSubjectRouter.get('/:id', isAuthenticated, async (req, res) => {
  const query = await ActiveSubject.findOne({
    where: { serial: req.params.id },
  });
  return res.status(200).json(query).end();
});

// To-Do: This needs to be throughly tested.
activeSubjectRouter.post(
  '/',
  setAuthorizedRoles([Role.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const postActiveSubject = PostActiveSubject.parse(req.body);
    const activeSubject = await ActiveSubject.create(postActiveSubject);
    return res.status(200).json(activeSubject).end();
  }
);

export default activeSubjectRouter;
