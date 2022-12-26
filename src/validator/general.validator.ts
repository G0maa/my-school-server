import { z } from 'zod';

// type CreateStudent = z.infer<typeof CreateStudent>; I forget how to do this a lot.
export const ZStudyYear = z.enum(['1', '2', '3']);
export const ZRole = z.enum(['Admin', 'Teacher', 'Student']);
export const ZGender = z.enum(['Male', 'Female']);
export const ZBloodGroup = z.enum([
  'O+',
  'O-',
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
]);
export const ZEducationType = z.enum(['Sceiences', 'Literature', 'Other']);

// Inferred Types
export type Role = z.infer<typeof ZRole>;
