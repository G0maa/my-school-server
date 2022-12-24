import { z } from 'zod';
import { EducationTypes, StudentClass } from './student.validator';

export const Subject = z.object({
  subjectId: z.string().max(6),
  name: z.string().max(64),
  class: StudentClass,
  educationType: EducationTypes,
});

// Less WET?
export const PostSubject = Subject.omit({}).extend({
  name: Subject.shape.name.optional(),
});
export type PostSubject = z.infer<typeof PostSubject>;
