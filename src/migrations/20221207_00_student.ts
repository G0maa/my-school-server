import { DataTypes } from 'sequelize';
import { Migration } from '../types';
import { ZEducationType, ZStudyYear } from '../validator/general.validator';

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
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: { model: 'users', key: 'id' },
    },
    study_year: {
      type: DataTypes.ENUM(...Object.values(ZStudyYear.enum)),
      allowNull: true,
    },
    education_type: {
      type: DataTypes.ENUM(...Object.values(ZEducationType.enum)),
      // type: DataTypes.ENUM(ZEducationType.Enum),
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
  await queryInterface.dropTable('students', {});
  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS enum_students_study_year'
  );
  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS enum_students_education_type'
  );
};
