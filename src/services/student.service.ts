/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Student, User } from '../models';
import { ZStudent } from '../validator/student.validator';
import { ZUser } from '../validator/user.validator';

const getStudents = async () => {
  const query = await Student.findAll();
  return query;
};

const getStudent = async (userId: string) => {
  const query = await Student.findOne({
    include: User,
    where: { userId },
  });
  return query;
};

const createStudent = async (zUser: ZUser, zStudent: ZStudent) => {
  zUser.role = 'Student';

  const student = await Student.create(
    {
      ...zStudent,
      user: { ...zUser },
    },
    {
      include: User,
    }
  );

  return student;
};

// To-do Delete student , test with classId existing, add classId to Validator
// test that classId actually references an actualy studyClass, etc...
const deleteStudent = async (userId: string) => {
  const student = await Student.destroy({ where: { userId } });
  return student;
};

export { getStudents, getStudent, createStudent, deleteStudent };
