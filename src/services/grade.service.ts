import Grade from '../models/grade';
import {
  ZGrade,
  ZGradeFind,
  ZGradePut,
  ZGradeSerial,
} from '../validator/grade.validator';

const getGrades = async (gradeFind: ZGradeFind) => {
  const grades = await Grade.findAll({ where: { ...gradeFind } });
  return grades;
};

const getGrade = async (serial: ZGradeSerial) => {
  const grade = await Grade.findOne({ where: { serial } });
  return grade;
};

const updateGrade = async (gradePut: ZGradePut) => {
  const grade = await Grade.findOne({ where: { serial: gradePut.serial } });

  if (!grade) return;

  grade.set(gradePut);

  await grade.save();

  return grade;
};

const addGrade = async (zGrade: ZGrade) => {
  const grade = await Grade.create({ ...zGrade });
  return grade;
};

const deleteGrade = async (serial: ZGradeSerial) => {
  const grade = await Grade.destroy({ where: { serial } });
  return grade;
};

export { getGrades, getGrade, updateGrade, addGrade, deleteGrade };
