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
  ZActiveSubjectDelete,
  ZActiveSubjectFind,
  ZActiveSubjectGet,
  ZActiveSubjectPost,
  ZActiveSubjectPut,
} from '../validator/activeSubject.validator';
import { ZRole } from '../validator/general.validator';

const activeSubjectRouter = express.Router();

activeSubjectRouter.get(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req, res) => {
    const { query } = ZActiveSubjectFind.parse(req);

    const result = await getActiveSubjects(query);

    return res.status(200).json(result).end();
  }
);

activeSubjectRouter.get('/:serial', isAuthenticated, async (req, res) => {
  const { params } = ZActiveSubjectGet.parse(req);

  const query = await getActiveSubject(params.serial);

  return res.status(200).json(query).end();
});

activeSubjectRouter.post(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const { body } = ZActiveSubjectPost.parse(req);

    const activeSubject = await createActiveSubject(body);

    return res.status(200).json(activeSubject).end();
  }
);

// not-tested
activeSubjectRouter.put(
  '/:serial',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const { params, body } = ZActiveSubjectPut.parse(req);

    const activeSubject = await updateActiveSubject({
      ...body,
      serial: params.serial,
    });

    return res.status(200).json(activeSubject).end();
  }
);

// Not-tested
activeSubjectRouter.delete(
  '/:serial',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req, res) => {
    const { params } = ZActiveSubjectDelete.parse(req);

    const activeSubject = await deleteActiveSubject(params.serial);

    return res.status(200).json(activeSubject).end();
  }
);
export default activeSubjectRouter;
