import { z } from 'zod';
import { ZEducationType, ZStudyYear } from './general.validator';

export const StudyClass = z.object({
  classId: z.string().max(6),
  class: ZStudyYear.optional(),
  educationType: ZEducationType.optional(),
});
export type StudyClass = z.infer<typeof StudyClass>;
