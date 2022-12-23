import { Admin, User } from '../models';
import { Role } from '../types';
import { hashPassword } from './helpers';

const init = async () => {
  console.log('Default username & password for admin is: A0001 : 000000');
  const res = await Admin.findAll();
  if (res.length !== 0) {
    return;
  }

  const password = '000000';
  const hashedPassword = await hashPassword(password);

  // this is solely for the purpose of testing if the user has a hashed password.
  // also #bug, isReset logic is illogical, if true => user can & should reset,
  // if false => user cannot reset.
  const admin = await User.create({
    username: 'A0001',
    password: hashedPassword,
    role: Role.Admin,
    isReset: true,
  });

  const student = await User.create({
    username: 'S0001',
    password,
    role: Role.Student,
    class: '1',
  });

  const teacher = await User.create({
    username: 'T0001',
    password,
    role: Role.Teacher,
  });

  await admin.$create('admin', { id: admin.id });
  await student.$create('student', { id: student.id, class: '1' });
  await teacher.$create('teacher', { id: teacher.id });
};

export default init;
