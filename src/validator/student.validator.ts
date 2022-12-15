import { z } from 'zod';

export const StudentClass = z.enum(['1', '2', '3']);
export const Roles = z.enum(['Admin', 'Teacher', 'Student']);

// id, name, email, username, password, role, isVerified, isReset
const User = z.object({
  id: z.string().uuid(),
  name: z.string().max(64),
  email: z.string().email().max(64),
  username: z.string().max(64).optional(),
  password: z.string().max(64).optional(),
  role: Roles,
  isVerified: z.boolean(),
  isReset: z.boolean(),
});
export type User = z.infer<typeof User>;

// class, parentName, parentPhoneNumber
// Weird way of setting defaults.
export const Student = User.extend({
  class: StudentClass,
  role: z.literal(Roles.enum.Student).default(Roles.enum.Student),
  parentName: z.string().max(64),
  parentPhonenumber: z.string().max(64),
});

// e.g. POST /api/student/
// specific details about student, for whatever reason.
// #Note: Verbose
export const PostFullStudent = Student.pick({
  name: true,
  class: true,
  username: true,
  password: true,
  parentName: true,
  parentPhonenumber: true,
});

// To-DO: Refactor, to have an object user & a student user.
export const PostStudent = Student.pick({
  class: true,
  username: true,
  role: true,
  password: true,
}).extend({
  role: z.literal(Roles.enum.Student).default(Roles.enum.Student),
});

// verify that the type is what you want & use if if needed, somewhere.
export type PostStudent = z.infer<typeof PostStudent>;

export const ValidateRawQuery = z.tuple([
  z.object({
    lastValue: z.string().nullable().optional(),
    maxSerial: z.number().nullable().optional(),
  }),
]);
