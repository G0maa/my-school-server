import { z } from 'zod';
import { ZStudent } from './student.validator';

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

export const ZFeeSerial = ZFee.shape.serial;
export type ZFeeSerial = z.infer<typeof ZFeeSerial>;

export const ZFeeFind = ZFee.pick({ serial: true, studentId: true }).partial();
export type ZFeeFind = z.infer<typeof ZFeeFind>;

export const ZFeePut = ZFee.required();
export type ZFeePut = z.infer<typeof ZFeePut>;
