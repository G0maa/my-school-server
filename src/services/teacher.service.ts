/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Teacher, User } from '../models';
import { ZTeacher } from '../validator/teacher.validator';
import { ZUser } from '../validator/user.validator';
import { deleteUser } from './user.service';

const getTeachers = async () => {
  const query = await Teacher.findAll();
  return query;
};

const getTeacher = async (userId: string) => {
  const query = await Teacher.findOne({
    include: User,
    where: { userId },
  });
  return query;
};

const createTeacher = async (user: ZUser, teacher: ZTeacher) => {
  user.role = 'Teacher';

  const newTeacher = await Teacher.create(
    {
      ...teacher,
      user: { ...user },
    },
    {
      include: User,
    }
  );

  return newTeacher;
};

// Deletion in an School System might be tricky,
// i.e. this teacher might be in some record in ActiveCourses.
// current implementation => Don't delete and give a not so useful error message.
const deleteTeacher = async (userId: string) => {
  const teacher = await deleteUser(userId);
  return teacher;
};

export { getTeacher, getTeachers, createTeacher, deleteTeacher };
