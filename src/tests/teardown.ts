import { rollbackAllMigrations } from '../utils/db';

export default async () => {
  await rollbackAllMigrations();
};
