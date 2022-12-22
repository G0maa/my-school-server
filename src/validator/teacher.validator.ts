import { z } from 'zod';
import { User, Roles } from './student.validator';

export const Teacher = User.extend({
  department: z.string().max(64),
  edication: z.string().max(64),
});

export const PostTeacher = Teacher.pick({
  username: true,
  role: true,
  password: true,
}).extend({
  role: z.literal(Roles.enum.Teacher).default(Roles.enum.Teacher),
});
export type PostTeacher = z.infer<typeof PostTeacher>;
