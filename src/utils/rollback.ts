import { rollbackMigration } from './db';

rollbackMigration()
  .then(() => {
    console.log('Rolling back the last migration: Down.');
  })
  .catch((error) => {
    console.error('Rolling back the last migration: FAILED.', error);
  });
