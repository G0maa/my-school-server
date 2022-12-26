import { z } from 'zod';
import { ZEducationType, ZStudyYear } from './general.validator';

export const ZSubject = z.object({
  subjectId: z.string().max(6),
  name: z.string().max(64).optional(),
  studyYear: ZStudyYear,
  educationType: ZEducationType,
});
export type ZSubject = z.infer<typeof ZSubject>;
