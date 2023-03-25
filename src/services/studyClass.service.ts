import StudyClass from '../models/class';
import { getPagination, querifyStringFields } from '../utils/helpers';
import {
  ZStudyClass,
  ZStudyClassFind,
} from '../validator/studyClass.validator';

// Searching not well tested
const getStudyClasses = async (searchQuery: ZStudyClassFind['query']) => {
  const { offset, limit, rest } = getPagination(searchQuery);

  const querified = querifyStringFields(rest, ZStudyClassFind.shape.query);

  const query = await StudyClass.findAndCountAll({
    where: querified,
    offset,
    limit,
  });
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

const updateStudyClass = async (zStudyClass: ZStudyClass) => {
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
const deleteStudyClass = async (classId: ZStudyClass['classId']) => {
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
