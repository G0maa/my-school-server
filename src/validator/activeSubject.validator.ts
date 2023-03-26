import { z } from 'zod';
import { ZPaginate } from './general.validator';
import { ZStudyClass } from './studyClass.validator';
import { ZSubject } from './subject.validator';
import { ZTeacher } from './teacher.validator';

// Zod, validated the record of the table.
// Sequelize, strips it down to the needed process.
// i.e. some client sends this object with the 'serial' attribute
// which is an auto incremented value in the DB,
// sequelize has to omit this value.
// P.S, this is inconsitent with DB design, all IDs are optional.
// P.P.S: This allows searching for non-existent IDs
export const ZActiveSubject = z.object({
  serial: z.coerce.number().positive().optional(),
  subjectId: ZSubject.shape.subjectId,
  classId: ZStudyClass.shape.classId,
  teacherId: ZTeacher.shape.userId,
  subjectSchedule: z.string().max(6).optional(),
});
export type ZActiveSubject = z.infer<typeof ZActiveSubject>;

export const ZActiveSubjectFind = z.object({
  query: ZActiveSubject.partial().merge(ZPaginate),
});
export type ZActiveSubjectFind = z.infer<typeof ZActiveSubjectFind>;

export const ZActiveSubjectGet = z.object({
  params: z.object({ serial: ZActiveSubject.shape.serial }).required(),
});
export type ZActiveSubjectGet = z.infer<typeof ZActiveSubjectGet>;

export const ZActiveSubjectPost = z.object({
  body: ZActiveSubject,
});
export type ZActiveSubjectPost = z.infer<typeof ZActiveSubjectPost>;

// This represents REST PUT,
// but doesn't represent DB SET NULL property on foreign keys.
export const ZActiveSubjectPut = z.object({
  params: z.object({ serial: ZActiveSubject.shape.serial }).required(),
  body: ZActiveSubject.omit({ serial: true }).required(),
});
export type ZActiveSubjectPut = z.infer<typeof ZActiveSubjectPut>;

export const ZActiveSubjectDelete = z.object({
  params: z.object({ serial: ZActiveSubject.shape.serial }).required(),
});
export type ZActiveSubjectDelete = z.infer<typeof ZActiveSubjectDelete>;
