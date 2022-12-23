import { z } from 'zod';
import { User, Roles } from './student.validator';

export const Teacher = User.extend({
  department: z.string().max(64),
  education: z.string().max(64),
});

export const PostTeacher = Teacher.pick({
  username: true,
  role: true,
  password: true,
}).extend({
  role: z.literal(Roles.enum.Teacher).default(Roles.enum.Teacher),
});
export type PostTeacher = z.infer<typeof PostTeacher>;

export const PostFullTeacher = Teacher.omit({
  id: true,
  isVerified: true,
  isReset: true,
}).extend({
  role: z.literal(Roles.enum.Teacher).default(Roles.enum.Teacher),
});
export type PostFullTeacher = z.infer<typeof PostFullTeacher>;
