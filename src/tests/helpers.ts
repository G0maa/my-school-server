import supertest from 'supertest';
import { User } from '../models';
import StudyClass from '../models/class';
import Subject from '../models/subject';
import { createActiveSubject } from '../services/activeSubject.service';
import { createStudent } from '../services/student.service';
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

export const getAdminCredentialsHeader = async (
  api: supertest.SuperTest<supertest.Test>,
  isJWT = false
) => {
  const response = await api
    .post('/api/auth/login')
    .send(adminCreds)
    .expect(200);

  console.log('response.body', response.body);

  let header = {};
  if (isJWT) {
    const token = response.body.token as string;
    header = { Authorization: `bearer ${token}` };

    await api.get('/testAuth').set(header).expect(200);

    return header;
  } else {
    const sessionId = response.headers['set-cookie'] as string;
    header = ['Cookie', [sessionId]];

    await api.get('/testAuth').set(header).expect(200);
    return header;
  }
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
  // To-Do, change to new syntax.
  const user = await User.create({ role: ZRole.enum.Teacher });
  await user.$create('teacher', { id: user.id });

  return user;
};

export const getDummyStudent = async () => {
  const student = createStudent({}, { studyYear: '1' });
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
