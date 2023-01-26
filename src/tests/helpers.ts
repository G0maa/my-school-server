import supertest from 'supertest';
import StudyClass from '../models/class';
import Subject from '../models/subject';
import { createActiveSubject } from '../services/activeSubject.service';
import { createUser } from '../services/user.service';
import { ZActiveSubject } from '../validator/activeSubject.validator';
import {
  ZEducationType,
  ZRole,
  ZStudyYear,
} from '../validator/general.validator';

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

export const getDummyClass = async () => {
  const [studyClass] = await StudyClass.findOrCreate({
    where: { classId: 'CCC000' },
    defaults: {
      classId: 'CCC000',
      studyYear: ZStudyYear.Enum[1],
      educationType: ZEducationType.Enum.Literature,
    },
  });

  return studyClass;
};

export const getDummySubject = async () => {
  const [subject] = await Subject.findOrCreate({
    where: { subjectId: 'SSS000' },
    defaults: {
      subjectId: 'SSS000',
      studyYear: ZStudyYear.Enum[1],
      educationType: ZEducationType.Enum.Literature,
    },
  });
  return subject;
};

export const getDummyTeacher = async () => {
  const teacher = await createUser({ role: ZRole.enum.Teacher }, {}, {});
  return teacher;
};

export const getDummyStudent = async () => {
  const student = createUser(
    { role: ZRole.enum.Student },
    {},
    { studyYear: '1' }
  );
  return student;
};

export const getDummyActiveSubject = async () => {
  const dummyTeacher = await getDummyTeacher();
  const dummySubject = await getDummySubject();
  const dummyClass = await getDummyClass();

  const dummyActiveSubject: ZActiveSubject = {
    subjectId: dummySubject.subjectId,
    classId: dummyClass.classId,
    teacherId: dummyTeacher.id,
    subjectSchedule: '1,2-3',
  };

  const activeSubject = await createActiveSubject(dummyActiveSubject);
  return activeSubject;
};
