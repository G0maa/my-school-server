import { Student, Teacher, User, Admin } from '../models';
import UserDetails from '../models/userDetails';
import { Role, ZUuid } from '../validator/general.validator';
import { ZStudentPost, ZStudentPut } from '../validator/student.validator';
import { ZTeacherPost, ZTeacherPut } from '../validator/teacher.validator';
import { ZUserPost, ZUserPut } from '../validator/user.validator';
import {
  ZUserDetailsPost,
  ZUserDetailsPut,
} from '../validator/userDetails.validator';

const roleModels = { Student, Teacher, Admin };

// Testing this out
const createUser = async (
  zUser: ZUserPost['body']['user'],
  zUserDetails: ZUserDetailsPost['body']['userDetails'],
  roleData: ZStudentPost['body']['student'] | ZTeacherPost['body']['teacher']
) => {
  const roleName = zUser.role.toLowerCase();

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

  return { user, userDetails, [roleName]: roleObject };
};

// Validation???
const deleteUser = async (id: ZUuid, role: Role) => {
  await User.destroy({ where: { id, role } });
};

export { createUser, updateUser, deleteUser };
