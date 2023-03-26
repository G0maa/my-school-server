import ActiveSubject from '../models/activeSubject';
import Grade from '../models/grade';
import { getPagination, querifyStringFields } from '../utils/helpers';
import { ZGrade, ZGradeFind, ZGradePut } from '../validator/grade.validator';
import { ZReqUser } from '../validator/user.validator';

const getGrades = async (gradeFind: ZGradeFind['query'], user: ZReqUser) => {
  const { offset, limit, rest } = getPagination(gradeFind);

  const querified = querifyStringFields(rest, ZGradeFind.shape.query);

  let grades;

  if (user.role === 'Admin') {
    grades = await Grade.findAndCountAll({ where: querified, offset, limit });
  } else if (user.role === 'Student') {
    grades = await Grade.findAndCountAll({
      where: { ...querified, studentId: user.id },
      offset,
      limit,
    });
  } else if (user.role === 'Teacher') {
    grades = await Grade.findAndCountAll({
      include: [{ model: ActiveSubject, where: { teacherId: user.id } }],
      attributes: { exclude: ['activeSubject'] },
      where: querified,
      offset,
      limit,
    });
  }

  return grades;
};

const getGrade = async (serial: ZGrade['serial'], user: ZReqUser) => {
  const grade = await Grade.findOne({
    where: { serial },
  });

  if (grade && (user.role === 'Admin' || user.id === grade.studentId))
    return grade;

  return;
};

const updateGrade = async (gradePut: ZGradePut['body']) => {
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

const deleteGrade = async (serial: ZGrade['serial']) => {
  const grade = await Grade.destroy({ where: { serial } });
  return grade;
};

export { getGrades, getGrade, updateGrade, addGrade, deleteGrade };
