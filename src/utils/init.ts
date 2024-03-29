import fs from 'fs';
import { Admin, Student, Teacher, User } from '../models';
import UserDetails from '../models/userDetails';
import { ZRole } from '../validator/general.validator';
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
  // also To-Do, isReset logic is illogical, if true => user can & should reset,
  await Admin.create(
    {
      user: {
        username: 'A0001',
        password: hashedPassword,
        role: ZRole.Enum.Admin,
        isReset: true,
        userDetails: {},
      },
    },
    {
      include: [{ model: User, include: [{ model: UserDetails }] }],
    }
  );

  await Student.create(
    {
      studyYear: '1',
      user: {
        username: 'S0001',
        password,
        role: ZRole.enum.Student,
        studyYear: '1',
        userDetails: {},
      },
    },
    {
      include: [{ model: User, include: [{ model: UserDetails }] }],
    }
  );

  await Teacher.create(
    {
      user: {
        username: 'T0001',
        password,
        role: ZRole.enum.Teacher,
        userDetails: {},
      },
    },
    {
      include: [{ model: User, include: [{ model: UserDetails }] }],
    }
  );

  // If user deletes these folders,
  // errors will happen.
  await fs.promises.mkdir('uploads/temp', { recursive: true });
  await fs.promises.mkdir('uploads/subjectsMaterial', { recursive: true });
};

export default init;
