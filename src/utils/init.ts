import { Admin } from '../models';

const init = async () => {
  // A0001 for Admins
  // T0001 for Teachers
  // S0001 for Students
  // P0001 for Parents
  // ...
  const res = await Admin.findAll();

  // To-Do
  // if (res.length === 0)
  //   await Admin.create({
  //     userId: 123,
  //   });
  console.log('res', res);
};

export default init;
