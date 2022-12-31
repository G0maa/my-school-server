import { z } from 'zod';
import { ToLikeQuery } from './general.validator';

// Caveat of this re-work,
// you're not veryfing referrentail integrtity here,
// which I guess is the job of the ORM?
export const ZTeacher = z
  .object({
    userId: z.string().uuid(),
    department: z.string().max(64),
    education: z.string().max(64),
  })
  .partial();

export const ZTeacherQuery = ZTeacher.extend({
  department: ZTeacher.shape.department.transform((attribute) =>
    ToLikeQuery(attribute)
  ),
}).partial();
export type ZTeacherQuery = z.infer<typeof ZTeacherQuery>;

export type ZTeacher = z.infer<typeof ZTeacher>;
