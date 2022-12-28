/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Student, User } from '../models';
import { ZStudent } from '../validator/student.validator';
import { ZUser } from '../validator/user.validator';
import { deleteUser } from './user.service';

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

const deleteStudent = async (userId: string) => {
  const student = await deleteUser(userId);
  return student;
};

export { getStudents, getStudent, createStudent, deleteStudent };
