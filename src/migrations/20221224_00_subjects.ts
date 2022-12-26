import { DataTypes } from 'sequelize';
import { Migration } from '../types';
import { ZEducationType, ZStudyYear } from '../validator/general.validator';

// subjectId is a code similar, which convention is to be decided.
export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('subjects', {
    subject_id: {
      type: DataTypes.STRING(6),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: true,
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
  await queryInterface.dropTable('subjects', {});
  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS enum_subjects_study_year'
  );
  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS enum_subjects_education_type'
  );
};
