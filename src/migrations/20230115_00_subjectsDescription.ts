import { DataTypes } from 'sequelize';
import { Migration } from '../types';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('subjects', 'description', {
    type: DataTypes.STRING(256),
    allowNull: true,
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('subjects', 'description');
};
