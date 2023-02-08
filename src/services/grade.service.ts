import ActiveSubject from '../models/activeSubject';
import Grade from '../models/grade';
import { ZGrade, ZGradeFind, ZGradePut } from '../validator/grade.validator';
import { ZReqUser } from '../validator/user.validator';

const getGrades = async (gradeFind: ZGradeFind['query'], user: ZReqUser) => {
  let grades;

  if (user.role === 'Admin') {
    grades = await Grade.findAll({ where: gradeFind });
  } else if (user.role === 'Student') {
    grades = await Grade.findAll({
      where: { ...gradeFind, studentId: user.id },
    });
  } else if (user.role === 'Teacher') {
    grades = await Grade.findAll({
      include: [{ model: ActiveSubject, where: { teacherId: user.id } }],
      where: { ...gradeFind },
      attributes: { exclude: ['activeSubject'] },
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
