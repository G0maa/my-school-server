import { DataTypes } from 'sequelize';
import { Migration } from '../types';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('grades', {
    serial: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
      autoIncrement: true,
    },
    active_subject_id: {
      type: DataTypes.INTEGER(),
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      allowNull: false,
      references: { model: 'active_subjects', key: 'serial' },
    },
    student_id: {
      type: DataTypes.UUID(),
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      allowNull: false,
      references: { model: 'students', key: 'user_id' },
    },
    exam: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    year_work: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('grades', {});
};
