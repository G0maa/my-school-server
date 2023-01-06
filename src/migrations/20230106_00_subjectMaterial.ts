import { DataTypes } from 'sequelize';
import { Migration } from '../types';

// Needs a better name.
export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('subjects_materials', {
    serial: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
      autoIncrement: true,
    },
    subject_id: {
      type: DataTypes.STRING(6),
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: { model: 'subjects', key: 'subject_id' },
    },
    teacher_id: {
      type: DataTypes.UUID(),
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      references: { model: 'teachers', key: 'user_id' },
    },
    file_name: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING(256),
      unique: true,
      allowNull: false,
    },
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('subjects_materials', {});
};
