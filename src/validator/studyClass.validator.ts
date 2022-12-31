import { z } from 'zod';
import { ToLikeQuery, ZEducationType, ZStudyYear } from './general.validator';

export const ZStudyClass = z.object({
  classId: z.string().max(6),
  studyYear: ZStudyYear.optional(),
  educationType: ZEducationType.optional(),
});

export const ZStudyClassQuery = ZStudyClass.extend({
  classId: ZStudyClass.shape.classId.transform((attrbiute) =>
    ToLikeQuery(attrbiute)
  ),
}).partial();

export type ZStudyClassQuery = z.infer<typeof ZStudyClassQuery>;
export type ZStudyClass = z.infer<typeof ZStudyClass>;
