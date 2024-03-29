import { z } from 'zod';
import { ZPaginate, ZRole, ZUuid } from './general.validator';

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

// Not the correct place for ZPaginate.
export const ZUserQuery = ZUser.omit({
  isReset: true,
  isVerified: true,
  password: true,
})
  .partial()
  .merge(ZPaginate);
export type ZUserQuery = z.infer<typeof ZUserQuery>;

// To-Do: I'm not sure about this, while it is true meaning wise,
// it might be better to create a single ZUuidReq or something
export const ZUserGetOne = z.object({
  params: z.object({ id: ZUuid }),
});
export type ZUserGetOne = z.infer<typeof ZUserGetOne>;

export const ZUserDelete = z.object({
  params: z.object({ id: ZUuid }),
});
export type ZUserDelete = z.infer<typeof ZUserDelete>;

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
    user: ZUser.pick({ email: true }).required(),
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
