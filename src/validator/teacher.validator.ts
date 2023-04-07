import { z } from 'zod';
import { ZUuid } from './general.validator';
import { ZUserPost, ZUserPut, ZUserQuery } from './user.validator';
import {
  ZUserDetailsPost,
  ZUserDetailsPut,
  ZUserDetailsQuery,
} from './userDetails.validator';

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
export type ZTeacher = z.infer<typeof ZTeacher>;

export const ZTeacherQuery = ZTeacher.omit({ userId: true }).partial();
export type ZTeacherQuery = z.infer<typeof ZTeacherQuery>;

export const ZTeacherFind = z.object({
  query: ZUserQuery.merge(ZUserDetailsQuery).merge(ZTeacherQuery),
  // .merge(ZPaginate),
});
export type ZTeacherFind = z.infer<typeof ZTeacherFind>;

export const ZTeacherPost = z.object({
  body: ZUserPost.shape.body.shape.user.extend({
    userDetails: ZUserDetailsPost.shape.body.shape.userDetails,
    teacher: ZTeacher.omit({ userId: true }).partial(),
  }),
});
export type ZTeacherPost = z.infer<typeof ZTeacherPost>;

export const ZTeacherPut = z.object({
  params: z.object({ id: ZUuid }),
  body: ZUserPut.shape.body.shape.user.extend({
    userDetails: ZUserDetailsPut.shape.body.shape.userDetails,
    teacher: ZTeacher.omit({ userId: true }).required(),
  }),
});
export type ZTeacherPut = z.infer<typeof ZTeacherPut>;
