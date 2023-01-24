/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Student, User } from '../models';
import UserDetails from '../models/userDetails';
import { ZStudentQuery } from '../validator/student.validator';
import { ZUserQuery } from '../validator/user.validator';
import { ZUserDetailsQuery } from '../validator/userDetails.validator';

// Searching not tested
const getStudents = async (
  searchQueryUser: ZUserQuery,
  searchQueryUserDetails: ZUserDetailsQuery,
  searchQueryStudent: ZStudentQuery
) => {
  const query = await Student.findAll({
    include: {
      model: User,
      where: { ...searchQueryUser },
      include: [{ model: UserDetails, where: { ...searchQueryUserDetails } }],
    },
    where: { ...searchQueryStudent },
  });
  return query;
};

const getStudent = async (userId: string) => {
  const query = await Student.findOne({
    include: [{ model: User, include: [{ model: UserDetails }] }],
    where: { userId },
  });
  return query;
};

export { getStudents, getStudent };
