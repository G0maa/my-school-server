import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import logger from './logger';
import config from './config';

const sequelize = new Sequelize(config.DATABASE_URL, {
  dialectOptions: {
    ssl:
      config.NODE_ENV === 'DEV'
        ? null
        : {
            require: false,
            rejectUnauthorized: false,
          },
  },
});

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

const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
};

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    logger.info('Successfully connected to PostgreSQL & Applied migrations.');
  } catch (error) {
    logger.error(error);
    throw new Error('Failed to connect to PostgreSQL');
  }
  return null;
};

export { sequelize, connectToDatabase, rollbackMigration };
