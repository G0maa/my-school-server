/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import StudyClass from '../models/class';
import {
  ZStudyClass,
  ZStudyClassPut,
  ZStudyClassQuery,
} from '../validator/studyClass.validator';

// Searching not well tested
const getStudyClasses = async (searchQuery: ZStudyClassQuery) => {
  const query = await StudyClass.findAll({ where: { ...searchQuery } });
  return query;
};

const getStudyClass = async (classId: string) => {
  const query = await StudyClass.findOne({
    where: { classId },
  });
  return query;
};

const createStudyClass = async (studyClass: ZStudyClass) => {
  const res = await StudyClass.create(studyClass);
  return res;
};

const updateStudyClass = async (zStudyClass: ZStudyClassPut) => {
  const studyClass = await StudyClass.findOne({
    where: {
      classId: zStudyClass.classId,
    },
  });

  if (!studyClass) return;

  studyClass.set({ ...zStudyClass });

  await studyClass.save();
  return studyClass;
};

// Not tested
const deleteStudyClass = async (classId: string) => {
  const res = await StudyClass.destroy({
    where: { classId },
  });
  return res;
};

export {
  getStudyClass,
  getStudyClasses,
  createStudyClass,
  updateStudyClass,
  deleteStudyClass,
};
