import { DataTypes } from 'sequelize';
import { Migration } from '../types';

// These two functions get passed the context in migrationConf in db.js
export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('students', 'class_id', {
    type: DataTypes.STRING(6),
    allowNull: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    references: { model: 'study_classes', key: 'class_id' },
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('students', 'class_id');
};
