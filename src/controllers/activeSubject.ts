/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import {
  createActiveSubject,
  deleteActiveSubject,
  getActiveSubject,
  getActiveSubjects,
  updateActiveSubject,
} from '../services/activeSubject.service';
import { setAuthorizedRoles, isAuthenticated } from '../utils/middleware';
import {
  ZActiveSubject,
  ZActiveSubjectPut,
  ZActiveSubjectQuery,
} from '../validator/activeSubject.validator';
import { ZRole } from '../validator/general.validator';

const activeSubjectRouter = express.Router();

// #17 very WET CRUD operations.
activeSubjectRouter.get(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin, ZRole.enum.Teacher]),
  isAuthenticated,
  async (req, res) => {
    const searchQuery = ZActiveSubjectQuery.parse(req.query);
    const query = await getActiveSubjects(searchQuery);
    return res.status(200).json(query).end();
  }
);

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

// not-tested
activeSubjectRouter.put(
  '/:id',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const zActiveSubject = ZActiveSubjectPut.parse({
      ...req.body,
      serial: req.params.id,
    });
    const activeSubject = await updateActiveSubject(zActiveSubject);
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
