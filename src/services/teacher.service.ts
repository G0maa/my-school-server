/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Teacher, User } from '../models';
import UserDetails from '../models/userDetails';
import { ZTeacherQuery } from '../validator/teacher.validator';
import { ZUserQuery } from '../validator/user.validator';

// This one is missing UserDetails.
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
    include: [{ model: User, include: [{ model: UserDetails }] }],
    where: { userId },
  });
  return query;
};

export { getTeacher, getTeachers };
