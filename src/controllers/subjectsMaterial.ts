/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import {
  addSubjectMaterial,
  getOneSubjectMaterial,
  getSubjectMaterial,
  getSubjectsMaterial,
} from '../services/subjectsMaterial.service';
import {
  setAuthorizedRoles,
  isAuthenticated,
  uploadFile,
} from '../utils/middleware';
import { ZRole } from '../validator/general.validator';
import { ZSubjectId } from '../validator/subject.validator';
import {
  ZSubjectsMaterial,
  ZSubjectsMaterialVerify,
} from '../validator/subjectsMaterial.validator';

const subjectMaterialRouter = express.Router();

// Needs testing
// This router is very experimental, lots of validations & verifications are missing.
subjectMaterialRouter.get(
  '/',
  setAuthorizedRoles([ZRole.enum.Admin, ZRole.enum.Student]),
  isAuthenticated,
  async (_req, res) => {
    const query = await getSubjectsMaterial();
    return res.status(200).json(query).end();
  }
);

// Download, needs some love.
subjectMaterialRouter.get(
  '/:subjectId/:serial',
  setAuthorizedRoles([ZRole.enum.Admin, ZRole.enum.Student]),
  isAuthenticated,
  async (req, res) => {
    console.log('req.params', req.params);
    const requestObject = ZSubjectsMaterialVerify.parse(req.params);

    const oneSubjectMaterial = await getOneSubjectMaterial(requestObject);

    if (!oneSubjectMaterial)
      return res.status(401).json({ message: 'File not found' });

    return res.status(200).download(oneSubjectMaterial.filePath);
  }
);

// Get table of that particular subject
subjectMaterialRouter.get('/:subjectId', isAuthenticated, async (req, res) => {
  const zSubjectId = ZSubjectId.parse(req.params.subjectId);
  const query = await getSubjectMaterial(zSubjectId);
  return res.status(200).json(query).end();
});

// Upload & add to DB
subjectMaterialRouter.post(
  '/:subjectId',
  setAuthorizedRoles([ZRole.enum.Admin, ZRole.enum.Teacher]),
  isAuthenticated,
  uploadFile.single('pdf'),
  async (req: Request, res: Response) => {
    if (!req.file)
      return res.status(401).json({ message: 'No files were sent' }).end();
    const zSubjectMaterial = ZSubjectsMaterial.parse({
      ...req.body,
      subjectId: req.params.subjectId,
    });

    const subjectMaterial = await addSubjectMaterial(
      zSubjectMaterial,
      req.file
    );

    if (!subjectMaterial)
      return res.status(401).json({ message: 'Subject non-existent' }).end();

    return res.status(200).json(subjectMaterial).end();
  }
);

export default subjectMaterialRouter;
