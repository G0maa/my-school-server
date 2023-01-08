import { z } from 'zod';
import { ToLikeQuery } from './general.validator';
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
  serial: z.number().positive().optional(),
  subjectId: ZSubject.shape.subjectId,
  classId: ZStudyClass.shape.classId,
  teacherId: ZTeacher.shape.userId,
  subjectSchedule: z.string().max(6).optional(),
});

export const ZActiveSubjectQuery = ZActiveSubject.extend({
  subjectSchedule: ZActiveSubject.shape.subjectSchedule.transform((attribute) =>
    ToLikeQuery(attribute)
  ),
}).partial();

// This represents REST PUT,
// but doesn't represent DB SET NULL property on foreign keys.
export const ZActiveSubjectPut = ZActiveSubject.required();
export type ZActiveSubjectPut = z.infer<typeof ZActiveSubjectPut>;
export type ZActiveSubjectQuery = z.infer<typeof ZActiveSubjectQuery>;
export type ZActiveSubject = z.infer<typeof ZActiveSubject>;
