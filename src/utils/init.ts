import { Admin, User } from '../models';
import { Role } from '../types';
import { hashPassword } from './helpers';

const init = async () => {
  console.log('Default username & password for admin is: A0001 : 000000');
  const res = await Admin.findAll();
  if (res.length !== 0) {
    return;
  }

  const passwordHash = await hashPassword('000000');

  const admin = await User.create({
    username: 'A0001',
    password: passwordHash,
    role: Role.Admin,
  });

  await admin.$create('Admin', admin);
};

export default init;
