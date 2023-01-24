import { z } from 'zod';
import { ToLikeQuery, ZUuid } from './general.validator';
import { ZUserPost, ZUserPut } from './user.validator';
import { ZUserDetailsPost, ZUserDetailsPut } from './userDetails.validator';

// Caveat of this re-work,
// you're not veryfing referrentail integrtity here,
// which I guess is the job of the ORM?
// where's serial?
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

export const ZTeacherPost = z.object({
  body: ZUserPost.shape.body
    .merge(ZUserDetailsPost.shape.body)
    .extend({ teacher: ZTeacher.omit({ userId: true }).partial() }),
});
export type ZTeacherPost = z.infer<typeof ZTeacherPost>;

export const ZTeacherPut = z.object({
  params: z.object({ id: ZUuid }),
  body: ZUserPut.shape.body.merge(ZUserDetailsPut.shape.body).extend({
    teacher: ZTeacher.omit({ userId: true }).required(),
  }),
});

export type ZTeacherPut = z.infer<typeof ZTeacherPut>;
export type ZTeacherQuery = z.infer<typeof ZTeacherQuery>;
export type ZTeacher = z.infer<typeof ZTeacher>;
