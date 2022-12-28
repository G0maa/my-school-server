import { User } from '../models';

const deleteUser = async (id: string) => {
  await User.destroy({ where: { id } });
};

export { deleteUser };
