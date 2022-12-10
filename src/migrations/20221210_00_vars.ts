import { DataTypes } from 'sequelize';
import { Migration } from '../types';

// These two functions get passed the context in migrationConf in db.js
export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('vars', {
    var_name: {
      type: DataTypes.STRING(24),
      primaryKey: true,
    },
    value: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      defaultValue: 1,
    },
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('vars');
};
