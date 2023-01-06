import { z } from 'zod';
import { ZSubject } from './subject.validator';
import { ZTeacher } from './teacher.validator';

export const ZSubjectsMaterial = z.object({
  // serial: z.number().positive().optional(),
  serial: z.coerce.number().optional(),
  subjectId: ZSubject.shape.subjectId,
  teacherId: ZTeacher.shape.userId.optional(),
  fileName: z.string().min(1).max(64),
  filePath: z.string().min(1).max(64).optional(),
});

export const ZSubjectsMaterialVerify = ZSubjectsMaterial.pick({
  serial: true,
  subjectId: true,
}).required();
export type ZSubjectsMaterialVerify = z.infer<typeof ZSubjectsMaterialVerify>;
export type ZSubjectsMaterial = z.infer<typeof ZSubjectsMaterial>;
