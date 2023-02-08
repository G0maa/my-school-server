import { z } from 'zod';

// Not sure if coersion is a safe option here,
// It might be in ZHolidaySerial, but not here.
export const ZHoliday = z.object({
  serial: z.coerce.number().positive().optional(),
  name: z.string().max(32),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});
export type ZHoliday = z.infer<typeof ZHoliday>;

// export const ZHolidaySerial = ZHoliday.shape.serial;
// export type ZHolidaySerial = z.infer<typeof ZHolidaySerial>;
export const ZHolidayPost = z.object({
  body: ZHoliday,
});
export type ZHolidayPost = z.infer<typeof ZHolidayPost>;

export const ZHolidayDelete = z.object({
  params: z.object({ serial: ZHoliday.shape.serial }).required(),
});
export type ZHolidayDelete = z.infer<typeof ZHolidayDelete>;
