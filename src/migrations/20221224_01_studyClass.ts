import { DataTypes } from 'sequelize';
import { EducationTypes, Class, Migration } from '../types';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('study_classes', {
    class_id: {
      type: DataTypes.STRING(6),
      primaryKey: true,
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
  await queryInterface.dropTable('study_classes', {});
  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS enum_study_classes_class'
  );
  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS enum_study_classes_education_type'
  );
};
