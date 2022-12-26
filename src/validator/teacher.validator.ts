import { z } from 'zod';

// Caveat of this re-work,
// you're not veryfing referrentail integrtity here,
// which I guess is the job of the ORM?
export const ZTeacher = z
  .object({
    userId: z.string().uuid(),
    department: z.string().max(64),
    education: z.string().max(64),
  })
  .partial();
export type ZTeacher = z.infer<typeof ZTeacher>;
