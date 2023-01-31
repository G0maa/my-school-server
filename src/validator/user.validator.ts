import { z } from 'zod';
import { ToLikeQuery, ZRole, ZUuid } from './general.validator';

export const ZUser = z
  .object({
    id: z.string().uuid(),
    email: z.string().email().max(64),
    username: z.string().max(64),
    password: z.string().min(6).max(64),
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

export const ZUserResetPassword = z
  .object({
    currentPassword: ZUser.shape.password,
    newPassword: ZUser.shape.password,
  })
  .required();
export type ZUserResetPassword = z.infer<typeof ZUserResetPassword>;

export const ZUserLogin = z.object({
  body: z.object({
    username: ZUser.shape.username,
    password: ZUser.shape.password,
  }),
});
export type ZUserLogin = z.infer<typeof ZUserLogin>;

export const ZReqUser = ZUser.pick({
  id: true,
  role: true,
  username: true,
}).required();
export type ZReqUser = z.infer<typeof ZReqUser>;
