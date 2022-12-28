/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import StudyClass from '../models/class';
import { ZStudyClass } from '../validator/studyClass.validator';

const getStudyClasses = async () => {
  const query = await StudyClass.findAll();
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

// Not tested
const deleteStudyClass = async (classId: string) => {
  const res = await StudyClass.destroy({
    where: { classId },
  });
  return res;
};

export { getStudyClass, getStudyClasses, createStudyClass, deleteStudyClass };
