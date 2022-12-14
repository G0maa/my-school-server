/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Teacher, User } from '../models';
import {
  ZTeacher,
  ZTeacherPut,
  ZTeacherQuery,
} from '../validator/teacher.validator';
import { ZUser, ZUserPut, ZUserQuery } from '../validator/user.validator';
import { deleteUser, updateUser } from './user.service';

const getTeachers = async (
  searchQueryUser: ZUserQuery,
  searchQueryTeacher: ZTeacherQuery
) => {
  const query = await Teacher.findAll({
    include: { model: User, where: { ...searchQueryUser } },
    where: { ...searchQueryTeacher },
  });
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

const updateTeacher = async (zUser: ZUserPut, zTeacher: ZTeacherPut) => {
  await updateUser(zUser);

  const teacher = await Teacher.findOne({ where: { userId: zTeacher.userId } });

  if (!teacher) return;

  teacher.set({ ...zTeacher });

  await teacher.save();

  return teacher;
};

// Deletion in an School System might be tricky,
// i.e. this teacher might be in some record in ActiveCourses.
// current implementation => Don't delete and give a not so useful error message.
const deleteTeacher = async (userId: string) => {
  const teacher = await deleteUser(userId);
  return teacher;
};

export { getTeacher, getTeachers, createTeacher, updateTeacher, deleteTeacher };
