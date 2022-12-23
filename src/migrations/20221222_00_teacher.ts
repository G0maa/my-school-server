import { DataTypes } from 'sequelize';
import { Migration } from '../types';

// These two functions get passed the context in migrationConf in db.js
export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('teachers', {
    serial: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.UUID(),
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    education: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('teachers', {});
};
