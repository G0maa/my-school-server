/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Student, User } from '../models';
import { ZStudent, ZStudentQuery } from '../validator/student.validator';
import { ZUser, ZUserQuery } from '../validator/user.validator';
import { deleteUser } from './user.service';

// Searching not tested
const getStudents = async (
  searchQueryUser: ZUserQuery,
  searchQueryStudent: ZStudentQuery
) => {
  const query = await Student.findAll({
    include: { model: User, where: { ...searchQueryUser } },
    where: { ...searchQueryStudent },
  });
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

const deleteStudent = async (userId: string) => {
  const student = await deleteUser(userId);
  return student;
};

export { getStudents, getStudent, createStudent, deleteStudent };
