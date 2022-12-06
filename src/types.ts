import { InferAttributes, QueryInterface } from 'sequelize';
import { MigrationParams } from 'umzug';
import { User } from './models';
// This is from the docs of umzug.. sort of.
// https://github.com/sequelize/umzug
export type Migration = (
  params: MigrationParams<QueryInterface>
) => Promise<unknown>;

export enum Role {
  Student = 'Student',
  Teacher = 'Teacher',
  Admin = 'Admin',
  Parent = 'Parent',
}

export type UserType = InferAttributes<User>;

export interface SerializedUser {
  id: string;
  firstName: string;
  role: Role;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id: string;
      username: string;
      role: Role;
    }
  }
}

export {};
