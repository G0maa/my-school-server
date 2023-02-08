/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from 'express';
import {
  addSubjectMaterial,
  deleteOneSubjectMaterial,
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
import { ZSubjectGetOne } from '../validator/subject.validator';
import {
  ZSubjectsMaterialOne,
  ZSubjectsMaterialPost,
} from '../validator/subjectsMaterial.validator';

const subjectMaterialRouter = express.Router();

// Needs testing
// This router is very experimental, lots of validations & verifications are missing.
subjectMaterialRouter.get('/', isAuthenticated, async (_req, res) => {
  const query = await getSubjectsMaterial();

  return res.status(200).json(query).end();
});

// Download, needs some love.
subjectMaterialRouter.get(
  '/:subjectId/:serial',
  isAuthenticated,
  async (req, res) => {
    const { params } = ZSubjectsMaterialOne.parse(req);

    const oneSubjectMaterial = await getOneSubjectMaterial(params);

    if (!oneSubjectMaterial)
      return res.status(401).json({ message: 'File not found' });

    return res.status(200).download(oneSubjectMaterial.filePath);
  }
);

// Get table of that particular subject
subjectMaterialRouter.get('/:subjectId', isAuthenticated, async (req, res) => {
  const { params } = ZSubjectGetOne.parse(req);

  const query = await getSubjectMaterial(params.id);

  return res.status(200).json(query).end();
});

// Upload & add to DB
subjectMaterialRouter.post(
  '/:subjectId',
  setAuthorizedRoles([ZRole.enum.Admin, ZRole.enum.Teacher]),
  isAuthenticated,
  uploadFile.single('pdf'),
  async (req: Request, res: Response) => {
    const { params, body } = ZSubjectsMaterialPost.parse(req);

    if (!req.file)
      return res
        .status(401)
        .json({ message: 'Unsupported file extension' })
        .end();

    const subjectMaterial = await addSubjectMaterial(
      { ...body, subjectId: params.subjectId },
      req.file
    );

    if (!subjectMaterial)
      return res.status(400).json({ message: 'Subject non-existent' }).end();

    return res.status(200).json(subjectMaterial).end();
  }
);

subjectMaterialRouter.delete(
  '/:subjectId/:serial',
  setAuthorizedRoles([ZRole.enum.Admin, ZRole.enum.Teacher]),
  isAuthenticated,
  async (req: Request, res: Response) => {
    const { params } = ZSubjectsMaterialOne.parse(req);

    await deleteOneSubjectMaterial(params);

    return res.status(204).end();
  }
);

export default subjectMaterialRouter;
