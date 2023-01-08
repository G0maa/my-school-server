import { z } from 'zod';
import { ZActiveSubject } from './activeSubject.validator';
import { ZStudent } from './student.validator';

export const ZGrade = z
  .object({
    serial: z.coerce.number().positive().optional(),
    studentId: ZStudent.shape.userId,
    activeSubjectId: ZActiveSubject.shape.serial,
    yearWork: z.number().positive().max(40),
    exam: z.number().positive().max(60),
  })
  .required()
  .partial({ serial: true });
export type ZGrade = z.infer<typeof ZGrade>;

export const ZGradeFind = ZGrade.pick({
  studentId: true,
  activeSubjectId: true,
}).partial();
export type ZGradeFind = z.infer<typeof ZGradeFind>;

export const ZGradePut = ZGrade.required();
export type ZGradePut = z.infer<typeof ZGradePut>;

export const ZGradeSerial = ZGrade.shape.serial;
export type ZGradeSerial = z.infer<typeof ZGradeSerial>;
