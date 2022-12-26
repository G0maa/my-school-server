import { Admin, Student, Teacher, User } from '../models';
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
  // also #bug, isReset logic is illogical, if true => user can & should reset,
  // if false => user cannot reset.
  // const admin = await User.create({
  //   username: 'A0001',
  //   password: hashedPassword,
  //   role: ZRole.enum.Admin,
  //   isReset: true,
  // });

  await Admin.create(
    {
      user: {
        username: 'A0001',
        password: hashedPassword,
        role: ZRole.Enum.Admin,
        isReset: true,
      },
    },
    {
      include: User,
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
      },
    },
    {
      include: User,
    }
  );

  await Teacher.create(
    {
      user: {
        username: 'T0001',
        password,
        role: ZRole.enum.Teacher,
      },
    },
    {
      include: User,
    }
  );

  // const student = await User.create({
  //   username: 'S0001',
  //   password,
  //   role: ZRole.enum.Student,
  //   studyYear: '1',
  // });

  // const teacher = await User.create({
  // username: 'T0001',
  // password,
  // role: ZRole.enum.Teacher,
  // });

  // // To-Do: Use the newly discovered syntax.
  // await admin.$create('admin', { id: admin.id });
  // await student.$create('student', { userId: student.id, studyYear: '1' });
  // await teacher.$create('teacher', { userId: teacher.id });
};

export default init;
