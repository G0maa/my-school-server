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
  ZSubjectDelete,
  ZSubjectFind,
  ZSubjectGetOne,
  ZSubjectPost,
  ZSubjectPut,
} from '../validator/subject.validator';

const subjectRouter = express.Router();

// Searching not tested,
subjectRouter.get(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin, ZRole.enum.Student]),
  isAuthenticated,
  async (req, res) => {
    /* 
      #swagger.tags = ['Subjects']
      #swagger.security = [{ "cookieAuth": [] }]
    */
    const { query } = ZSubjectFind.parse(req);

    const result = await getSubjects(query);

    return res.status(200).json(result).end();
  }
);

subjectRouter.get('/:id', isAuthenticated, async (req, res) => {
  /* 
    #swagger.tags = ['Subjects']
    #swagger.security = [{ "cookieAuth": [] }]
  */
  const { params } = ZSubjectGetOne.parse(req);

  const query = await getSubject(params.id);

  return res.status(200).json(query).end();
});

subjectRouter.post(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    /* 
      #swagger.tags = ['Subjects']
      #swagger.security = [{ "cookieAuth": [] }]
    */
    const { body } = ZSubjectPost.parse(req);

    const subject = await createSubject(body);

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
    /* 
      #swagger.tags = ['Subjects']
      #swagger.security = [{ "cookieAuth": [] }]
    */
    const { params, body } = ZSubjectPut.parse(req);

    // returns undefiend if not found => to-do: Return a proper message
    const subject = await updateSubject({ subjectId: params.id, ...body });

    return res.status(200).json(subject).end();
  }
);

subjectRouter.delete(
  '/:id',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    /* 
      #swagger.tags = ['Subjects']
      #swagger.security = [{ "cookieAuth": [] }]
    */
    const { params } = ZSubjectDelete.parse(req);

    const subject = await deleteSubject(params.id);

    return res.status(200).json(subject).end();
  }
);

export default subjectRouter;
