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

  const student = await User.create({
    username: 'S0001',
    password: passwordHash,
    role: Role.Student,
    class: '1',
  });

  const teacher = await User.create({
    username: 'T0001',
    password: passwordHash,
    role: Role.Student,
  });

  await admin.$create('admin', { id: admin.id });
  await student.$create('student', { id: student.id, class: '1' });
  await teacher.$create('teacher', { id: teacher.id });
};

export default init;
