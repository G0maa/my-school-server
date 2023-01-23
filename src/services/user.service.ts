import { Student, Teacher, User, Admin } from '../models';
import UserDetails from '../models/userDetails';
import { ZStudent } from '../validator/student.validator';
import { ZTeacher } from '../validator/teacher.validator';
import { ZUser, ZUserPut } from '../validator/user.validator';
import { ZUserDetails } from '../validator/userDetails.validator';

type ZModel = ZTeacher | ZStudent;
const childModels = { Student, Teacher, Admin };
// Testing this out
const createUser = async (
  zUser: ZUser,
  zUserDetails: ZUserDetails,
  zModel: ZModel
) => {
  // Dealt with in route?
  // zUser.role = 'Student';

  const childModel = zUser.role.toLowerCase();

  const user = await User.create(
    {
      ...zUser,
      [childModel]: { ...zModel },
      userDetails: { ...zUserDetails },
    },
    {
      include: [childModels[zUser.role], UserDetails],
    }
  );

  return user;
};

const updateUser = async (zUser: ZUserPut) => {
  const user = await User.findOne({ where: { id: zUser.id } });

  if (!user) return;

  user.set({ ...zUser });

  await user.save();
};

// Validation???
const deleteUser = async (id: string) => {
  await User.destroy({ where: { id } });
};

export { createUser, updateUser, deleteUser };
