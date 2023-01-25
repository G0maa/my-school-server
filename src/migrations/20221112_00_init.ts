import { DataTypes } from 'sequelize';
import { Migration } from '../types';
import { ZRole } from '../validator/general.validator';

// These two functions get passed the context in migrationConf in db.js
export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('users', {
    id: {
      type: DataTypes.UUID(),
      defaultValue: DataTypes.UUIDV4(),
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(5), // Make it six for good measures? :D
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(ZRole.enum)),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    is_verified: {
      type: DataTypes.BOOLEAN(),
      defaultValue: false,
    },
    is_reset: {
      type: DataTypes.BOOLEAN(),
      defaultValue: true,
    },
    updated_at: DataTypes.DATE,
    created_at: DataTypes.DATE,
  });
  await queryInterface.createTable('admins', {
    serial: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.UUID(),
      allowNull: false,
      // This particular one is RESTRICT,
      // because deletion of an admin is kind of dangerous.
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
      references: { model: 'users', key: 'id' },
    },
  });
};

// There's a bug when you use dropTable without empty options object,
// normal dropTable does not delete ENUMS, so I'm keeping this raw query:
// await queryInterface.sequelize.query('DROP TYPE [IF EXISTS] enum_users_blood_group');
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('admins', {});
  await queryInterface.dropTable('users', {});
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_users_role');
};
