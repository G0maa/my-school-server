import { z } from 'zod';

// TS didn't like this:
// type Role = z.infer<typeof ZRole>;
// export type Role = 'Admin' | 'Teacher' | 'Student';
export enum Role {
  Student = 'Student',
  Teacher = 'Teacher',
  Admin = 'Admin',
}

// type CreateStudent = z.infer<typeof CreateStudent>; I forget how to do this a lot.
export const ZStudyYear = z.enum(['1', '2', '3']);
// export const ZRole = z.enum(['Student', 'Teacher', 'Admin']);
export const ZRole = z.nativeEnum(Role);
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
export type StudyYear = z.infer<typeof ZStudyYear>;
// export type Role = z.infer<typeof ZRole>;
export type Gender = z.infer<typeof ZGender>;
export type BloodGroup = z.infer<typeof ZBloodGroup>;
export type EducationType = z.infer<typeof ZEducationType>;
