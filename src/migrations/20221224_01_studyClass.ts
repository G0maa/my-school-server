import { DataTypes } from 'sequelize';
import { Migration } from '../types';
import { ZEducationType, ZStudyYear } from '../validator/general.validator';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('study_classes', {
    class_id: {
      type: DataTypes.STRING(6),
      primaryKey: true,
    },
    study_year: {
      type: DataTypes.ENUM(...Object.values(ZStudyYear.Enum)),
      allowNull: false,
    },
    education_type: {
      type: DataTypes.ENUM(...Object.values(ZEducationType.Enum)),
      allowNull: false,
    },
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('study_classes', {});
  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS enum_study_classes_study_year'
  );
  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS enum_study_classes_education_type'
  );
};
