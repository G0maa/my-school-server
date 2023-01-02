import { User } from '../models';
import { ZUserPut } from '../validator/user.validator';

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

export { updateUser, deleteUser };
