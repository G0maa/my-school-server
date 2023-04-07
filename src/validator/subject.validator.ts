import { z } from 'zod';
import { ZEducationType, ZPaginate, ZStudyYear } from './general.validator';

export const ZSubject = z.object({
  subjectId: z.string().max(6),
  name: z.string().max(64).optional(),
  studyYear: ZStudyYear,
  educationType: ZEducationType,
});
export type ZSubject = z.infer<typeof ZSubject>;

export const ZSubjectFind = z.object({
  query: ZSubject.pick({ subjectId: true, name: true })
    .partial()
    .merge(ZPaginate),
});
export type ZSubjectFind = z.infer<typeof ZSubjectFind>;

export const ZSubjectGetOne = z.object({
  params: z.object({ id: ZSubject.shape.subjectId }),
});
export type ZSubjectGetOne = z.infer<typeof ZSubjectGetOne>;

export const ZSubjectPost = z.object({
  body: ZSubject,
});
export type ZSubjectPost = z.infer<typeof ZSubjectPost>;

export const ZSubjectPut = z.object({
  params: z.object({ id: ZSubject.shape.subjectId }),
  body: ZSubject.omit({ subjectId: true }).required(),
});
export type ZSubjectPut = z.infer<typeof ZSubjectPut>;

export const ZSubjectDelete = z.object({
  params: z.object({ id: ZSubject.shape.subjectId }),
});
export type ZSubjectDelete = z.infer<typeof ZSubjectDelete>;
