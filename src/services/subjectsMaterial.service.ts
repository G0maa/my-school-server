import fs from 'fs';
import Subject from '../models/subject';
import SubjectMaterial from '../models/subjectsMaterial';
import { ZSubjectId } from '../validator/subject.validator';
import {
  ZSubjectsMaterial,
  ZSubjectsMaterialVerify,
} from '../validator/subjectsMaterial.validator';

const getSubjectsMaterial = async () => {
  const subjectMaterial = await SubjectMaterial.findAll();
  return subjectMaterial;
};

const getSubjectMaterial = async (subjectId: ZSubjectId) => {
  const subjectMaterial = await SubjectMaterial.findAll({
    where: { subjectId },
  });
  return subjectMaterial;
};

// Refactor, very similar to the one above, & rename
const getOneSubjectMaterial = async (verifyObject: ZSubjectsMaterialVerify) => {
  const subjectMaterial = await SubjectMaterial.findOne({
    where: { ...verifyObject },
  });

  return subjectMaterial;
};

// From multer docs:
// Note that req.body might not have been fully populated yet.
// It depends on the order that the client transmits fields and files to the server.
// Needs refactorting
const addSubjectMaterial = async (
  zSubjectMaterial: ZSubjectsMaterial,
  file: Express.Multer.File
) => {
  const subject = await Subject.findOne({
    where: { subjectId: zSubjectMaterial.subjectId },
  });

  // should delete file. & refactor to use error middleware.
  if (!subject) return;

  // Need to create said folders or will throw error
  const filePath = `uploads\\subjectMaterial\\${zSubjectMaterial.subjectId}\\${file.originalname}`;

  fs.renameSync(file.path, filePath);

  const subjectMaterial = await SubjectMaterial.create({
    ...zSubjectMaterial,
    filePath,
  });
  return subjectMaterial;
};

export {
  getSubjectsMaterial,
  getSubjectMaterial,
  addSubjectMaterial,
  getOneSubjectMaterial,
};
