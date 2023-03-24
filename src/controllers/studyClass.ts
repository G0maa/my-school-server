/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import {
  createStudyClass,
  deleteStudyClass,
  getStudyClass,
  getStudyClasses,
  updateStudyClass,
} from '../services/studyClass.service';
import { setAuthorizedRoles, isAuthenticated } from '../utils/middleware';
import { ZRole } from '../validator/general.validator';
import {
  ZStudyClassDelete,
  ZStudyClassFind,
  ZStudyClassGet,
  ZStudyClassPost,
  ZStudyClassPut,
} from '../validator/studyClass.validator';

const studyClassRouter = express.Router();

studyClassRouter.get('/', isAuthenticated, async (req, res) => {
  /* 
    #swagger.tags = ['Study Classes']
    #swagger.security = [{ "cookieAuth": [] }]
  */
  const { query } = ZStudyClassFind.parse(req);

  const result = await getStudyClasses(query);

  return res.status(200).json(result).end();
});

studyClassRouter.get('/:classId', isAuthenticated, async (req, res) => {
  /* 
    #swagger.tags = ['Study Classes']
    #swagger.security = [{ "cookieAuth": [] }]
  */
  const { params } = ZStudyClassGet.parse(req);

  const query = await getStudyClass(params.classId);

  return res.status(200).json(query).end();
});

studyClassRouter.post(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req, res) => {
    /* 
      #swagger.tags = ['Study Classes']
      #swagger.security = [{ "cookieAuth": [] }]
    */
    const { body } = ZStudyClassPost.parse(req);

    const studyClass = await createStudyClass(body);

    return res.status(200).json(studyClass).end();
  }
);

// Not tested
studyClassRouter.put(
  '/:classId',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req, res) => {
    /* 
      #swagger.tags = ['Study Classes']
      #swagger.security = [{ "cookieAuth": [] }]
    */
    const { params, body } = ZStudyClassPut.parse(req);

    // returns undefiend if not found => to-do: Return a proper message
    const studyClass = await updateStudyClass({
      ...body,
      classId: params.classId,
    });

    return res.status(200).json(studyClass).end();
  }
);

// Not tested
studyClassRouter.delete(
  '/:classId',
  setAuthorizedRoles([ZRole.enum.Admin]),
  isAuthenticated,
  async (req, res) => {
    /* 
      #swagger.tags = ['Study Classes']
      #swagger.security = [{ "cookieAuth": [] }]
    */
    const { params } = ZStudyClassDelete.parse(req);

    const studyClass = await deleteStudyClass(params.classId);

    return res.status(200).json(studyClass).end();
  }
);

export default studyClassRouter;
