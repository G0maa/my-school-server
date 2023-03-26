import { z } from 'zod';
import { ZSubject } from './subject.validator';
import { ZTeacher } from './teacher.validator';
import { ZPaginate } from './general.validator';

export const ZSubjectsMaterial = z.object({
  serial: z.coerce.number().optional(),
  subjectId: ZSubject.shape.subjectId,
  teacherId: ZTeacher.shape.userId.optional(),
  fileName: z.string().min(1).max(64),
  filePath: z.string().min(1).max(64).optional(),
});
export type ZSubjectsMaterial = z.infer<typeof ZSubjectsMaterial>;

export const ZSubjectsMaterialFind = z.object({
  query: ZSubjectsMaterial.pick({
    subjectId: true,
    teacherId: true,
    fileName: true,
  })
    .partial()
    .merge(ZPaginate),
});
export type ZSubjectsMaterialFind = z.infer<typeof ZSubjectsMaterialFind>;

export const ZSubjectsMaterialPost = z.object({
  params: ZSubjectsMaterial.pick({ subjectId: true }),
  body: ZSubjectsMaterial.omit({ serial: true, subjectId: true }),
});
export type ZSubjectsMaterialPost = z.infer<typeof ZSubjectsMaterialPost>;

export const ZSubjectsMaterialOne = z.object({
  params: ZSubjectsMaterial.pick({
    serial: true,
    subjectId: true,
  }).required(),
});
export type ZSubjectsMaterialOne = z.infer<typeof ZSubjectsMaterialOne>;
