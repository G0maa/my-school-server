import { DataTypes } from 'sequelize';
import { Migration } from '../types';

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
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    is_verified: {
      type: DataTypes.BOOLEAN(),
      defaultValue: false,
    },
    updated_at: DataTypes.DATE,
    created_at: DataTypes.DATE,
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('users');
};
