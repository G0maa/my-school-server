import { z } from 'zod';
import { EducationTypes, StudentClass } from './student.validator';

export const StudyClass = z.object({
  classId: z.string().max(6),
  class: StudentClass,
  educationType: EducationTypes,
});

export const PostStudyClass = StudyClass.omit({});
export type PostStudyClass = z.infer<typeof PostStudyClass>;
