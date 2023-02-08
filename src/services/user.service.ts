import { Student, Teacher, User, Admin } from '../models';
import UserDetails from '../models/userDetails';
import {
  generateRandomPassword,
  verifyPassword,
  hashPassword,
} from '../utils/helpers';
import { Role, ZUuid } from '../validator/general.validator';
import {
  ZStudentPost,
  ZStudentPut,
  ZStudentQuery,
} from '../validator/student.validator';
import {
  ZTeacherPost,
  ZTeacherPut,
  ZTeacherQuery,
} from '../validator/teacher.validator';
import { ZUserPost, ZUserPut, ZUserQuery } from '../validator/user.validator';
import {
  ZUserDetailsPost,
  ZUserDetailsPut,
  ZUserDetailsQuery,
} from '../validator/userDetails.validator';

const roleModels = { Student, Teacher, Admin };

const getUsers = async (
  role: Role,
  userQuery: ZUserQuery,
  userDetailsQuery: ZUserDetailsQuery,
  roleQuery: ZStudentQuery | ZTeacherQuery
) => {
  const query = await User.findAll({
    include: [
      { model: UserDetails, where: { ...userDetailsQuery } },
      { model: roleModels[role], where: roleQuery },
    ],
    where: { role, ...userQuery },
  });
  return query;
};

// According to the types in the model,
// query.[model] might or might not exist.
const getUser = async (userId: ZUuid, role: Role) => {
  const query = await User.findOne({
    include: [{ model: UserDetails }, { model: roleModels[role] }],
    where: { id: userId, role },
  });
  return query;
};

// Testing this out
// Validators DOES NOT set role attribute by themselves.
const createUser = async (
  zUser: ZUserPost['body']['user'],
  zUserDetails: ZUserDetailsPost['body']['userDetails'],
  roleData: ZStudentPost['body']['student'] | ZTeacherPost['body']['teacher']
) => {
  const roleName = zUser.role.toLowerCase();

  // To-Do: This is not correctly typed.
  // i.e.: user.userDetails & user[roleName] do not exist in compile time,
  // although they exist at run time.
  const user = await User.create(
    {
      ...zUser,
      userDetails: { ...zUserDetails },
      [roleName]: roleData,
    },
    {
      include: [roleModels[zUser.role], UserDetails],
    }
  );
  return user;
};

const updateUser = async (
  userId: ZUuid,
  zUser: ZUserPut['body']['user'],
  zUserDetails: ZUserDetailsPut['body']['userDetails'],
  roleData: ZStudentPut['body']['student'] | ZTeacherPut['body']['teacher']
) => {
  const user = await User.findOne({ where: { id: userId } });
  const userDetails = await UserDetails.findOne({
    where: { userId },
  });

  if (!user || !userDetails) return;

  const roleName = user.role.toLowerCase() as Role;
  const roleObject = await roleModels[user.role].findOne({
    where: { userId },
  });

  if (!roleObject) return;

  user.set({ ...zUser });
  userDetails.set({ ...zUserDetails });
  roleObject.set({ ...roleData });

  // Note this is a transaction, supposedly if one fails all should be reverted.
  // this relates to issue #34
  await user.save();
  await userDetails.save();
  await roleObject.save();

  // ...user, trying to make the response body somewhat consistent.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return { ...user, userDetails, [roleName]: roleObject };
};

// Validation???
const deleteUser = async (id: ZUuid, role: Role) => {
  await User.destroy({ where: { id, role } });
};

const resetPassword = async (id: ZUuid) => {
  const user = await User.findOne({ where: { id } });

  if (!user) return;

  // isReset = Password is in plain-text and not hashed,
  // purpose of this: admin can see the password & then "give" it to users,
  // i.e. a warning for users that their password needs to be resetted.
  user.isReset = false;
  user.password = generateRandomPassword();

  await user.save();

  return user;
};

const changePassword = async (
  id: ZUuid,
  currentPassword: string,
  newPassword: string
) => {
  const user = await User.findOne({ where: { id } });

  if (!user) return;

  let isCorrect = false;
  // isReset === true => means the password has been reset before;
  // therefore it is hashed.

  if (user.isReset) {
    isCorrect = await verifyPassword(currentPassword, user.password);
  } else {
    isCorrect = user.password === currentPassword;
  }

  // Funny that your account hangs on a single if condition.
  if (!isCorrect) return;

  user.isReset = true;
  user.password = await hashPassword(newPassword);
  await user.save();

  return user;
};

export {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  changePassword,
};
