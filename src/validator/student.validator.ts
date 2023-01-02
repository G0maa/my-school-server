import { z } from 'zod';
import { ToLikeQuery, ZEducationType, ZStudyYear } from './general.validator';
import { ZStudyClass } from './studyClass.validator';

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

export const ZStudentPut = ZStudent.required();
export type ZStudentPut = z.infer<typeof ZStudentPut>;
export type ZStudentQuery = z.infer<typeof ZStudentQuery>;

// What is this doing here?
export const ValidateRawQuery = z.tuple([
  z.object({
    lastValue: z.string().nullable().optional(),
    maxSerial: z.number().nullable().optional(),
  }),
]);
