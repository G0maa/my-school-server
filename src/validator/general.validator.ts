import { Op } from 'sequelize';
import { z } from 'zod';
import { Bug } from '../types';
// type CreateStudent = z.infer<typeof CreateStudent>; I forget how to do this a lot.
export const ZUuid = z.string().uuid();
export const ZStudyYear = z.enum(['1', '2', '3']);
export const ZRole = z.enum(['Student', 'Teacher', 'Admin']);
// export const ZRole = z.nativeEnum(zRole);
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
export const ToLikeQuery = (attribute: string | undefined | null) => {
  if (!attribute) return;
  return { [Op.like]: `%${attribute}%` };
};

// Inferred Types
export type StudyYear = z.infer<typeof ZStudyYear>;
export type Role = z.infer<typeof ZRole>;
export type Gender = z.infer<typeof ZGender>;
export type BloodGroup = z.infer<typeof ZBloodGroup>;
export type EducationType = z.infer<typeof ZEducationType>;
export type ZUuid = z.infer<typeof ZUuid>;
export type FixBug = Bug;
