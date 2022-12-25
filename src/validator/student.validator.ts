import { z } from 'zod';

// type CreateStudent = z.infer<typeof CreateStudent>;
export const StudentClass = z.enum(['1', '2', '3']);
export const Roles = z.enum(['Admin', 'Teacher', 'Student']);
export const Gender = z.enum(['Male', 'Female']);
export const BloodGroups = z.enum([
  'O+',
  'O-',
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
]);
export const EducationTypes = z.enum(['Sceiences', 'Literature', 'Other']);

// id, name, email, username, password, role, isVerified, isReset
export const ZUser = z
  .object({
    id: z.string().uuid(),
    firstName: z.string().max(64),
    lastName: z.string().max(64),
    gender: Gender,
    mobile: z.string().max(20),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    registerDate: z.coerce.date(),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    dateOfBirth: z.coerce.date(),
    bloodGroup: BloodGroups,
    address: z.string().max(64),
    email: z.string().email().max(64),
    username: z.string().max(64).optional(),
    password: z.string().max(64).optional(),
    role: Roles,
    isVerified: z.boolean(),
    isReset: z.boolean(),
  })
  .partial();
export type ZUser = z.infer<typeof ZUser>;

export const ZStudent = z
  .object({
    userId: z.string().uuid(),
    class: StudentClass,
    educationType: EducationTypes,
    parentName: z.string().max(64),
    parentPhonenumber: z.string().max(64),
  })
  .partial();
export type ZStudent = z.infer<typeof ZStudent>;

export const ValidateRawQuery = z.tuple([
  z.object({
    lastValue: z.string().nullable().optional(),
    maxSerial: z.number().nullable().optional(),
  }),
]);

// ==========================
// Just temporary for backwards compatability with other non-changed tests/logic
// ==========================
export const User = z.object({
  id: z.string().uuid(),
  firstName: z.string().max(64),
  lastName: z.string().max(64),
  gender: Gender,
  mobile: z.string().max(20),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  registerDate: z.coerce.date(),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  dateOfBirth: z.coerce.date(),
  bloodGroup: BloodGroups,
  address: z.string().max(64),
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
  educationType: EducationTypes,
  parentName: z.string().max(64),
  parentPhonenumber: z.string().max(64),
});

// e.g. POST /api/student/
// specific details about student, for whatever reason.
// #Note: Verbose
// #Note2: Unsure about the final version of this.
export const PostFullStudent = Student.omit({
  id: true,
  isVerified: true,
  isReset: true,
}).extend({
  role: z.literal(Roles.enum.Student).default(Roles.enum.Student),
});

export type PostFullStudent = z.infer<typeof PostFullStudent>;
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
