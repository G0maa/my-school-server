import { z } from 'zod';
import { ToLikeQuery, ZRole, ZUuid } from './general.validator';

export const ZUser = z
  .object({
    id: z.string().uuid(),
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

export const ZUserQuery = ZUser.extend({
  username: ZUser.shape.username.transform((attribute) =>
    ToLikeQuery(attribute)
  ),
}).partial();
export type ZUserQuery = z.infer<typeof ZUserQuery>;

export const ZUserPost = z.object({
  body: z.object({
    user: ZUser.omit({ isVerified: true, isReset: true, id: true })
      .partial()
      .required({ role: true }),
  }),
});
export type ZUserPost = z.infer<typeof ZUserPost>;

export const ZUserPut = z.object({
  params: z.object({ id: ZUuid }),
  body: z.object({
    user: ZUser.pick({ email: true }),
    // userDetails: ZUserDetails.required().omit({ serial: true }),
  }),
});
export type ZUserPut = z.infer<typeof ZUserPut>;
