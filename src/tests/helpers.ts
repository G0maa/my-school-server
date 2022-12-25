import supertest from 'supertest';
import { User } from '../models';
import StudyClass from '../models/class';
import Subject from '../models/subject';
import { Class, EducationTypes, Role } from '../types';

const adminCreds = {
  username: 'A0001',
  password: '000000',
};

export const loginAdmin = async (api: supertest.SuperTest<supertest.Test>) => {
  const response = await api
    .post('/api/auth/login')
    .send(adminCreds)
    .expect(200);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return response.headers['set-cookie'];
};

export const getDummyClassId = async () => {
  const [studyClass] = await StudyClass.findOrCreate({
    where: { classId: 'CCC000' },
    defaults: {
      classId: 'CCC000',
      class: Class.First,
      educationType: EducationTypes.Literature,
    },
  });

  return studyClass.classId;
};

export const getDummySubjectId = async () => {
  const [subject] = await Subject.findOrCreate({
    where: { subjectId: 'SSS000' },
    defaults: {
      subjectId: 'SSS000',
      class: Class.First,
      educationType: EducationTypes.Literature,
    },
  });
  return subject.subjectId;
};

export const getDummyTeacher = async () => {
  const user = await User.create({ role: Role.Teacher });
  await user.$create('teacher', { id: user.id });

  return user;
};
