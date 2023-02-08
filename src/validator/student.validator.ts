import { z } from 'zod';
import {
  ToLikeQuery,
  ZEducationType,
  ZStudyYear,
  ZUuid,
} from './general.validator';
import { ZStudyClass } from './studyClass.validator';
import { ZUserPost, ZUserPut, ZUserQuery } from './user.validator';
import {
  ZUserDetailsPost,
  ZUserDetailsPut,
  ZUserDetailsQuery,
} from './userDetails.validator';

export const ZStudent = z
  .object({
    userId: z.string().uuid(),
    classId: ZStudyClass.shape.classId.nullable(),
    studyYear: ZStudyYear,
    educationType: ZEducationType,
    parentName: z.string().max(64),
    parentPhonenumber: z.string().max(64),
  })
  .partial()
  .required({ studyYear: true });
export type ZStudent = z.infer<typeof ZStudent>;

export const ZStudentQuery = ZStudent.partial()
  .extend({
    classId: ZStudent.shape.classId.transform((attribute) =>
      ToLikeQuery(attribute)
    ), // duplicate use Z
    parentName: ZStudent.shape.parentName.transform((attribute) =>
      ToLikeQuery(attribute)
    ),
    parentPhonenumber: ZStudent.shape.parentPhonenumber.transform((attribute) =>
      ToLikeQuery(attribute)
    ),
  })
  .partial();
export type ZStudentQuery = z.infer<typeof ZStudentQuery>;

export const ZStudentFind = z.object({
  query: ZUserQuery.merge(ZUserDetailsQuery).merge(ZStudentQuery),
});
export type ZStudentFind = z.infer<typeof ZStudentFind>;

// This doesn't require studyYear or educationType
export const ZStudentPost = z.object({
  body: ZUserPost.shape.body.shape.user.extend({
    userDetails: ZUserDetailsPost.shape.body.shape.userDetails,
    student: ZStudent.omit({ userId: true })
      .partial()
      .required({ studyYear: true }),
  }),
});
export type ZStudentPost = z.infer<typeof ZStudentPost>;

// This implicitly means he can change classId, studyYear, educationType.
// resulting in a possible invalid state. To-Do: Ensure valid state in every PUT request
// Notice, here we included three entities, User, UserDetails & Student,
// as opposed to the PUT validator for User and UserDetails, which contained their Zod Schema only.
export const ZStudentPut = z.object({
  params: z.object({ id: ZUuid }),
  body: ZUserPut.shape.body.shape.user.extend({
    userDetails: ZUserDetailsPut.shape.body.shape.userDetails,
    student: ZStudent.omit({ userId: true }).required(),
  }),
});
export type ZStudentPut = z.infer<typeof ZStudentPut>;

// What is this doing here?
export const ValidateRawQuery = z.tuple([
  z.object({
    lastValue: z.string().nullable().optional(),
    maxSerial: z.number().nullable().optional(),
  }),
]);
