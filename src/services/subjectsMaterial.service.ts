import fs from 'fs';
import Subject from '../models/subject';
import SubjectsMaterial from '../models/subjectsMaterial';
import { ZSubject } from '../validator/subject.validator';
import {
  ZSubjectsMaterial,
  ZSubjectsMaterialFind,
  ZSubjectsMaterialOne,
} from '../validator/subjectsMaterial.validator';
import { getPagination, querifyStringFields } from '../utils/helpers';

const getSubjectsMaterial = async (
  searchQuery: ZSubjectsMaterialFind['query']
) => {
  const { limit, offset, rest } = getPagination(searchQuery);

  const querified = querifyStringFields(
    rest,
    ZSubjectsMaterialFind.shape.query
  );

  const subjectMaterial = await SubjectsMaterial.findAndCountAll({
    where: querified,
    offset,
    limit,
  });
  return subjectMaterial;
};

const getSubjectMaterial = async (subjectId: ZSubject['subjectId']) => {
  const subjectMaterial = await SubjectsMaterial.findAll({
    where: { subjectId },
  });
  return subjectMaterial;
};

// Refactor, very similar to the one above, & rename
const getOneSubjectMaterial = async (
  verifyObject: ZSubjectsMaterialOne['params']
) => {
  const subjectMaterial = await SubjectsMaterial.findOne({
    where: { ...verifyObject },
  });

  return subjectMaterial;
};

// Repeated file names get updated without updating the DB, also giving wrong status code.
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
  const filePath = `uploads\\subjectsMaterial\\${zSubjectMaterial.subjectId}\\${file.originalname}`;

  // recursive option makes it not complain about folders already existing.
  await fs.promises.mkdir(
    `uploads/subjectsMaterial/${zSubjectMaterial.subjectId}`,
    { recursive: true }
  );
  await fs.promises.rename(file.path, filePath);

  const subjectMaterial = await SubjectsMaterial.create({
    ...zSubjectMaterial,
    filePath,
  });
  return subjectMaterial;
};

const deleteOneSubjectMaterial = async (
  verifyObject: ZSubjectsMaterialOne['params']
) => {
  const deletedMaterial = await SubjectsMaterial.findOne({
    where: { ...verifyObject },
  });

  if (!deletedMaterial) return;

  fs.unlinkSync(deletedMaterial.filePath);

  await deletedMaterial.destroy();
  return;
};

export {
  getSubjectsMaterial,
  getSubjectMaterial,
  addSubjectMaterial,
  getOneSubjectMaterial,
  deleteOneSubjectMaterial,
};
