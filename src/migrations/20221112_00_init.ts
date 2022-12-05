import { DataTypes } from 'sequelize';
import { Migration } from '../types';
import { Role } from '../types';
// These two functions get passed the context in migrationConf in db.js
export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('users', {
    id: {
      type: DataTypes.UUID(),
      defaultValue: DataTypes.UUIDV4(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    username: {
      type: DataTypes.STRING(5), // Make it six for good measures? :D
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(Role)),
      allowNull: false,
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
    user_id: {
      type: DataTypes.UUID(),
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('admins');
  await queryInterface.dropTable('users');
};
