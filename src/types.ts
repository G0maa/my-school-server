import { QueryInterface } from 'sequelize';
import { MigrationParams } from 'umzug';
import { Role } from './validator/general.validator';

// This is from the docs of umzug.. sort of.
// https://github.com/sequelize/umzug
export type Migration = (
  params: MigrationParams<QueryInterface>
) => Promise<unknown>;

// You have to import something from types.ts for declarations to work.
// https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript
// https://stackoverflow.com/questions/40743131/how-to-prevent-property-does-not-exist-on-type-global-with-jsdom-and-t
export type Bug = 'bug';

export interface Paginate {
  page?: number;
  size?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
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
