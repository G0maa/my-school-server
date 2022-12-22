import { rollbackAllMigrations } from './db';

// This gets called from CLI only, no need for eslint.
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-floating-promises
rollbackAllMigrations();
