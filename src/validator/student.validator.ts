import { z } from 'zod';
import { ZEducationType, ZStudyYear } from './general.validator';

export const ZStudent = z
  .object({
    userId: z.string().uuid(),
    studyYear: ZStudyYear,
    educationType: ZEducationType,
    parentName: z.string().max(64),
    parentPhonenumber: z.string().max(64),
  })
  .partial()
  .required({ studyYear: true });
export type ZStudent = z.infer<typeof ZStudent>;

export const ValidateRawQuery = z.tuple([
  z.object({
    lastValue: z.string().nullable().optional(),
    maxSerial: z.number().nullable().optional(),
  }),
]);
