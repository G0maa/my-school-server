import { Sequelize } from 'sequelize-typescript';
import { Umzug, SequelizeStorage } from 'umzug';
import logger from './logger';
import config from './config';
import { Admin, Student, Teacher, User } from '../models';
import Subject from '../models/subject';
import StudyClass from '../models/class';
import ActiveSubject from '../models/activeSubject';

const sequelize = new Sequelize(config.DATABASE_URL, {
  dialectOptions: {
    ssl:
      config.NODE_ENV === 'PROD'
        ? {
            require: false,
            rejectUnauthorized: false,
          }
        : null,
  },
  logging: config.NODE_ENV === 'DEV' ? console.log : false,
});

sequelize.addModels([
  Admin,
  Student,
  User,
  Teacher,
  Subject,
  StudyClass,
  ActiveSubject,
]);

const migrationConf = {
  migrations: {
    glob: 'src/migrations/*.ts',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.up();
  logger.info('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  });
};

// #17 Need to hang this laundry
const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
};

const rollbackAllMigrations = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down({ to: 0 });
};

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    logger.info('Successfully connected to PostgreSQL & Applied migrations.');
  } catch (error) {
    logger.error(error);
    throw new Error('Failed to connect to PostgreSQL or Apply Migrations.');
  }
  return null;
};

export {
  sequelize,
  connectToDatabase,
  rollbackMigration,
  runMigrations,
  rollbackAllMigrations,
};
