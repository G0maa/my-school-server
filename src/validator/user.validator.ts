import { z } from 'zod';
import { ZBloodGroup, ZGender, ZRole } from './general.validator';

export const ZUser = z
  .object({
    id: z.string().uuid(),
    firstName: z.string().max(64),
    lastName: z.string().max(64),
    gender: ZGender,
    mobile: z.string().max(20),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    registerDate: z.coerce.date(),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    dateOfBirth: z.coerce.date(),
    bloodGroup: ZBloodGroup,
    address: z.string().max(64),
    email: z.string().email().max(64),
    username: z.string().max(64),
    password: z.string().max(64),
    role: ZRole,
    isVerified: z.boolean(),
    isReset: z.boolean(),
  })
  .partial()
  .required({ role: true });
export type ZUser = z.infer<typeof ZUser>;
