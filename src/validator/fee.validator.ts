import { z } from 'zod';
import { ZStudent } from './student.validator';
import { ZReqUser } from './user.validator';

export const ZFee = z
  .object({
    serial: z.coerce.number().positive().optional(),
    studentId: ZStudent.shape.userId,
    feeType: z.string(),
    amount: z.number().positive(),
    dueDate: z.coerce.date(),
    isPaid: z.boolean().optional(), // ORM sets this one too.
  })
  .required({ studentId: true });
export type ZFee = z.infer<typeof ZFee>;

// export const ZFeeFind = ZFee.pick({ serial: true, studentId: true }).partial();
export const ZFeeFind = z.object({
  query: ZFee.pick({ serial: true, studentId: true }).partial(),
  user: ZReqUser,
});
export type ZFeeFind = z.infer<typeof ZFeeFind>;

export const ZFeeGet = z.object({
  params: z.object({ serial: ZFee.shape.serial }).required(),
  user: ZReqUser,
});

export const ZFeePost = z.object({
  body: ZFee,
});
export type ZFeePost = z.infer<typeof ZFeePost>;

export const ZFeePut = z.object({
  body: ZFee.required(),
});
export type ZFeePut = z.infer<typeof ZFeePut>;

export const ZFeeDelete = z.object({
  params: z.object({ serial: ZFee.shape.serial }).required(),
});
export type ZFeeDelete = z.infer<typeof ZFeeDelete>;
