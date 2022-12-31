import { z } from 'zod';
import { ToLikeQuery, ZEducationType, ZStudyYear } from './general.validator';

export const ZSubject = z.object({
  subjectId: z.string().max(6),
  name: z.string().max(64).optional(),
  studyYear: ZStudyYear,
  educationType: ZEducationType,
});

export const ZSubjectQuery = ZSubject.extend({
  subjectId: ZSubject.shape.studyYear.transform((attribute) =>
    ToLikeQuery(attribute)
  ),
  name: ZSubject.shape.name.transform((attribute) => ToLikeQuery(attribute)),
}).partial();
export type ZSubject = z.infer<typeof ZSubject>;
export type ZSubjectQuery = z.infer<typeof ZSubjectQuery>;
