import { z } from 'zod';
import { ZBloodGroup, ZGender, ZUuid } from './general.validator';

export const ZUserDetails = z
  .object({
    serial: z.coerce.number().positive().optional(), // To-Do: Create zod schema for all serials
    userId: z.string().uuid(),
    firstName: z.string().max(64),
    lastName: z.string().max(64),
    gender: ZGender,
    mobile: z.string().max(20),
    registerDate: z.coerce.date(),
    dateOfBirth: z.coerce.date(),
    bloodGroup: ZBloodGroup,
    address: z.string().max(64),
  })
  .partial();
export type ZUserDetails = z.infer<typeof ZUserDetails>;

export const ZUserDetailsQuery = ZUserDetails.omit({
  userId: true,
  serial: true,
}).partial();
export type ZUserDetailsQuery = z.infer<typeof ZUserDetailsQuery>;

export const ZUserDetailsPost = z.object({
  body: z.object({
    userDetails: ZUserDetails.omit({ serial: true, userId: true }).partial(),
  }),
});
export type ZUserDetailsPost = z.infer<typeof ZUserDetailsPost>;

// There's no controller for ZUserDetailsPut, but it might be convineient
// to make every Z<Model>Put the same structure.
export const ZUserDetailsPut = z.object({
  params: ZUuid,
  body: z.object({
    userDetails: ZUserDetails.required().omit({ serial: true, userId: true }),
  }),
});
export type ZUserDetailsPut = z.infer<typeof ZUserDetailsPut>;
