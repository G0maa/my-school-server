/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import {
  createSubject,
  deleteSubject,
  getSubject,
  getSubjects,
  updateSubject,
} from '../services/subject.service';
import { setAuthorizedRoles, isAuthenticated } from '../utils/middleware';
import { ZRole } from '../validator/general.validator';
import {
  ZSubject,
  ZSubjectPut,
  ZSubjectQuery,
} from '../validator/subject.validator';

const subjectRouter = express.Router();

// #17 very WET CRUD operations.
// Searching not tested,
subjectRouter.get(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin, ZRole.enum.Student]),
  isAuthenticated,
  async (req, res) => {
    const searchQuery = ZSubjectQuery.parse(req.query);

    const query = await getSubjects(searchQuery);
    return res.status(200).json(query).end();
  }
);

subjectRouter.get('/:id', isAuthenticated, async (req, res) => {
  const zSubjectId = ZSubject.shape.subjectId.parse(req.params.id);
  const query = await getSubject(zSubjectId);
  return res.status(200).json(query).end();
});

subjectRouter.post(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const zSubject = ZSubject.parse(req.body);
    const subject = await createSubject(zSubject);
    return res.status(200).json(subject).end();
  }
);

// Not tested
// P.S: RESTful-wise, you have to send data for the whole resource.
subjectRouter.put(
  '/:id',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    // Replacing the subjectId in req.body, if it exists.
    const zSubject = ZSubjectPut.parse({
      ...req.body,
      subjectId: req.params.id,
    });
    // returns undefiend if not found => to-do: Return a proper message
    const subject = await updateSubject(zSubject);
    return res.status(200).json(subject).end();
  }
);

subjectRouter.delete(
  '/:id',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const zSubjectId = ZSubject.shape.subjectId.parse(req.params.id);
    const subject = await deleteSubject(zSubjectId);
    return res.status(200).json(subject).end();
  }
);

export default subjectRouter;
