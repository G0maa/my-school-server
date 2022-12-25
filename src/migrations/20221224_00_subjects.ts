import { DataTypes } from 'sequelize';
import { EducationTypes, Class, Migration } from '../types';

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
    class: {
      type: DataTypes.ENUM(...Object.values(Class)),
      allowNull: false,
    },
    education_type: {
      type: DataTypes.ENUM(...Object.values(EducationTypes)),
      allowNull: false,
    },
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('subjects', {});
  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS enum_subjects_class'
  );
  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS enum_subjects_education_type'
  );
};
