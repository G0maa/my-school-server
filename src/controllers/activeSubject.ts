/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import ActiveSubject from '../models/activeSubject';
import { setAuthorizedRoles, isAuthenticated } from '../utils/middleware';
import { ZActiveSubject } from '../validator/activeSubject.validator';
import { ZRole } from '../validator/general.validator';

const activeSubjectRouter = express.Router();

// #17 very WET CRUD operations.
activeSubjectRouter.get(
  '/',
  setAuthorizedRoles([ZRole.Enum.Admin]),
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
  setAuthorizedRoles([ZRole.Enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const zActiveSubject = ZActiveSubject.parse(req.body);
    const activeSubject = await ActiveSubject.create(zActiveSubject);
    return res.status(200).json(activeSubject).end();
  }
);

export default activeSubjectRouter;
