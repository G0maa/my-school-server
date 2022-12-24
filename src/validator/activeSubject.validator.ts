import { z } from 'zod';
import { StudyClass } from './studyClass.validator';
import { Subject } from './subject.validator';
import { Teacher } from './teacher.validator';

// Looks DRY eh?
export const ActiveSubject = z.object({
  serial: z.number().positive(),
  subjectId: Subject.shape.subjectId,
  classId: StudyClass.shape.classId,
  teacherId: Teacher.shape.id,
  subjectSchedule: z.string().max(6),
});

export const PostActiveSubject = ActiveSubject.omit({
  serial: true,
});
export type PostActiveSubject = z.infer<typeof PostActiveSubject>;
