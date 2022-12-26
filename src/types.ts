import { QueryInterface } from 'sequelize';
import { MigrationParams } from 'umzug';

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

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      allowedRoles: Role[];
    }
  }
}

export {};
