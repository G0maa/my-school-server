import supertest from 'supertest';
import StudyClass from '../models/class';
import Subject from '../models/subject';
import { createActiveSubject } from '../services/activeSubject.service';
import { createFee } from '../services/fee.service';
import { createUser } from '../services/user.service';
import { ZActiveSubject } from '../validator/activeSubject.validator';
import {
  ZEducationType,
  ZRole,
  ZStudyYear,
} from '../validator/general.validator';
import { ZUserLogin } from '../validator/user.validator';

const adminCreds: ZUserLogin['body'] = {
  username: 'A0001',
  password: '000000',
};

export const loginAdmin = async (
  api: supertest.SuperTest<supertest.Test>,
  creds?: ZUserLogin['body']
) => {
  const response = await api
    .post('/api/auth/login')
    .send(creds || adminCreds)
    .expect(200);

  const sessionId = response.headers['set-cookie'] as string;

  await api.get('/testAuth').set({ Cookie: sessionId }).expect(200);

  return { Cookie: sessionId };
};

// ### getters of simple entites used in testing ###

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

export const getDummyFee = async () => {
  const { id } = await getDummyStudent();

  const fee = await createFee({
    studentId: id,
    feeType: 'Tuituiotion',
    amount: 500,
    dueDate: new Date('2023-01-18'),
  });

  return fee;
};
