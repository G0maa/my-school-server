import { Admin, User, Var } from '../models';
import { Role } from '../types';
import { hashPassword } from './helpers';

const init = async () => {
  console.log('Default username & password for admin is: A0001 : 000000');
  const res = await Admin.findAll();
  if (res.length !== 0) {
    return;
  }

  const passwordHash = await hashPassword('000000');

  // new Admin({}); Admin.save();
  const admin = await User.create({
    username: 'A0001',
    password: passwordHash,
    role: Role.Admin,
  });

  await Var.create({
    varName: 'StudentUsername',
  });

  // This or use sequelize-hooks
  await admin.createAdmin();
};

export default init;
