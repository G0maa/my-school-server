/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import {
  createActiveSubject,
  deleteActiveSubject,
  getActiveSubject,
  getActiveSubjects,
} from '../services/activeSubject.service';
import { setAuthorizedRoles, isAuthenticated } from '../utils/middleware';
import { ZActiveSubject } from '../validator/activeSubject.validator';
import { ZRole } from '../validator/general.validator';

const activeSubjectRouter = express.Router();

// #17 very WET CRUD operations.
activeSubjectRouter.get(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (_req, res) => {
    const query = await getActiveSubjects();
    return res.status(200).json(query).end();
  }
);

// Lots of variations in this one.
// To-Do
// /api/activeSubjects/:id?query=teacher i.e. all classes & subjects for this teacher id
// /api/activeSubjects/:id?query=studyClass i.e. all subjects & teachers for this class
// /api/activeSubjects/:id?query=subject i.e. all classes & teachers for this subject
activeSubjectRouter.get('/:id', isAuthenticated, async (req, res) => {
  const query = await getActiveSubject(req.params.id);
  return res.status(200).json(query).end();
});

// To-Do: This needs to be throughly tested.
activeSubjectRouter.post(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const zActiveSubject = ZActiveSubject.parse(req.body);
    const activeSubject = await createActiveSubject(zActiveSubject);
    return res.status(200).json(activeSubject).end();
  }
);

// Not-tested
activeSubjectRouter.delete(
  '/:id',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const activeSubject = await deleteActiveSubject(req.params.id);
    return res.status(200).json(activeSubject).end();
  }
);
export default activeSubjectRouter;
