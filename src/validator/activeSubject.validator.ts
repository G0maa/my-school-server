import { z } from 'zod';
import { ZStudyClass } from './studyClass.validator';
import { ZSubject } from './subject.validator';
import { ZTeacher } from './teacher.validator';

// Zod, validated the record of the table.
// Sequelize, strips it down to the needed process.
// i.e. some client sends this object with the 'serial' attribute
// which is an auto incremented value in the DB,
// sequelize has to omit this value.
export const ZActiveSubject = z.object({
  serial: z.number().positive().optional(),
  subjectId: ZSubject.shape.subjectId,
  classId: ZStudyClass.shape.classId,
  teacherId: ZTeacher.shape.userId,
  subjectSchedule: z.string().max(6).optional(),
});
export type ZActiveSubject = z.infer<typeof ZActiveSubject>;
