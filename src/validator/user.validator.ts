import { z } from 'zod';
import { ToLikeQuery, ZBloodGroup, ZGender, ZRole } from './general.validator';

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
  .partial();
// .required({ role: true }); cannot set defaults now.

export const ZUserQuery = ZUser.extend({
  username: ZUser.shape.username.transform((attribute) =>
    ToLikeQuery(attribute)
  ),
  firstName: ZUser.shape.firstName.transform((attribute) =>
    ToLikeQuery(attribute)
  ),
}).partial();

export const ZUserPut = ZUser.omit({
  isVerified: true,
  isReset: true,
  role: true,
});

export type ZUserPut = z.infer<typeof ZUserPut>;
export type ZUserQuery = z.infer<typeof ZUserQuery>;
export type ZUser = z.infer<typeof ZUser>;
