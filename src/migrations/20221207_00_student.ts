import { DataTypes } from 'sequelize';
import { Class, Migration } from '../types';

// These two functions get passed the context in migrationConf in db.js
export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('students', {
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
    class: {
      type: DataTypes.ENUM(...Object.values(Class)),
      allowNull: true,
    },
    parent_name: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    parent_phonenumber: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('students');
};
