import { z } from 'zod';
import { ZActiveSubject } from './activeSubject.validator';
import { ZStudent } from './student.validator';
import { ZReqUser } from './user.validator';
import { ZPaginate } from './general.validator';

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

export const ZGradePost = z.object({
  body: ZGrade,
});
export type ZGradePost = z.infer<typeof ZGradePost>;

export const ZGradeFind = z.object({
  query: ZGrade.pick({
    studentId: true,
    activeSubjectId: true,
  })
    .partial()
    .merge(ZPaginate),
  user: ZReqUser,
});
export type ZGradeFind = z.infer<typeof ZGradeFind>;

export const ZGradeGet = z.object({
  params: z.object({ serial: ZGrade.shape.serial }).required(),
  user: ZReqUser,
});
export type ZGradeGet = z.infer<typeof ZGradeGet>;

export const ZGradePut = z.object({
  params: z.object({ serial: ZGrade.shape.serial }).required(),
  body: ZGrade.required(),
});
export type ZGradePut = z.infer<typeof ZGradePut>;

export const ZGradeDelete = z.object({
  params: z.object({ serial: ZGrade.shape.serial }).required(),
});
export type ZGradeDelete = z.infer<typeof ZGradeDelete>;
