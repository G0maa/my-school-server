import { DataTypes } from 'sequelize';
import { Migration } from '../types';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('holidays', {
    serial: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(32),
      unique: false,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATEONLY(),
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY(),
      allowNull: false,
    },
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('holidays', {});
};
