import { z } from 'zod';
import { ToLikeQuery, ZEducationType, ZStudyYear } from './general.validator';

// I'm keeping this as an "old" "style" of validation,
export const ZStudyClass = z.object({
  classId: z.string().max(6),
  studyYear: ZStudyYear.optional(),
  educationType: ZEducationType.optional(),
});
export type ZStudyClass = z.infer<typeof ZStudyClass>;

export const ZStudyClassQuery = ZStudyClass.extend({
  classId: ZStudyClass.shape.classId.transform((attrbiute) =>
    ToLikeQuery(attrbiute)
  ),
}).partial();

export type ZStudyClassQuery = z.infer<typeof ZStudyClassQuery>;
