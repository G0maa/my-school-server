import { DataTypes } from 'sequelize';
import { Migration } from '../types';

// Needs a better name.
export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('active_subjects', {
    serial: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
      autoIncrement: true,
    },
    class_id: {
      type: DataTypes.STRING(6),
      references: { model: 'study_classes', key: 'class_id' },
    },
    subject_id: {
      type: DataTypes.STRING(6),
      references: { model: 'subjects', key: 'subject_id' },
    },
    teacher_id: {
      type: DataTypes.UUID(),
      references: { model: 'teachers', key: 'user_id' },
    },
    subject_schedule: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('active_subjects', {});
};
