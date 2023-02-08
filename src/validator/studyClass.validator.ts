import { z } from 'zod';
import { ToLikeQuery, ZEducationType, ZStudyYear } from './general.validator';

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

export const ZStudyClassFind = z.object({
  query: ZStudyClassQuery,
});
export type ZStudyClassFind = z.infer<typeof ZStudyClassFind>;

export const ZStudyClassGet = z.object({
  params: z.object({ classId: ZStudyClass.shape.classId }).required(),
});
export type ZStudyClassGet = z.infer<typeof ZStudyClassGet>;

export const ZStudyClassPost = z.object({
  body: ZStudyClass,
});
export type ZStudyClassPost = z.infer<typeof ZStudyClassPost>;

export const ZStudyClassPut = z.object({
  params: z.object({ classId: ZStudyClass.shape.classId }).required(),
  body: ZStudyClass.omit({ classId: true }).required(),
});
export type ZStudyClassPut = z.infer<typeof ZStudyClassPut>;

export const ZStudyClassDelete = z.object({
  params: z.object({ classId: ZStudyClass.shape.classId }).required(),
});
export type ZStudyClassDelete = z.infer<typeof ZStudyClassDelete>;
