import { z } from 'zod';
import { ZEducationType, ZStudyYear } from './general.validator';

export const ZStudyClass = z.object({
  classId: z.string().max(6),
  studyYear: ZStudyYear.optional(),
  educationType: ZEducationType.optional(),
});
export type ZStudyClass = z.infer<typeof ZStudyClass>;
