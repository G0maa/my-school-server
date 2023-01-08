import { rollbackAllMigrations } from './db';

rollbackAllMigrations()
  .then(() => {
    console.log('Rolling back ALL migrations: Down.');
  })
  .catch((error) => {
    console.error('Rolling back ALL migrations: FAILED.', error);
  });
