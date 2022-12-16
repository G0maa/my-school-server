import { DataTypes } from 'sequelize';
import {
  BloodGroups,
  Class,
  EducationTypes,
  Gender,
  Migration,
  Role,
} from '../types';

// Adding these ENUMs to their appropriate files caused this Error:
// original: error: type "public.enum_users_blood_group" does not exist
export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('users', 'blood_group', {
    type: DataTypes.ENUM(...Object.values(BloodGroups)),
    allowNull: true,
  }),
    await queryInterface.addColumn('users', 'gender', {
      type: DataTypes.ENUM(...Object.values(Gender)),
      allowNull: true,
    }),
    await queryInterface.addColumn('users', 'role', {
      type: DataTypes.ENUM(...Object.values(Role)),
      allowNull: false,
    }),
    await queryInterface.addColumn('students', 'class', {
      type: DataTypes.ENUM(...Object.values(Class)),
      allowNull: true,
    });
  await queryInterface.addColumn('students', 'education_type', {
    type: DataTypes.ENUM(...Object.values(EducationTypes)),
    allowNull: true,
  });
};
// Removing a column or Dropping a table DOES NOT delete the ENUMS.
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('users', 'blood_group');
  await queryInterface.removeColumn('users', 'gender');
  await queryInterface.removeColumn('users', 'role');
  await queryInterface.removeColumn('students', 'class');
  await queryInterface.removeColumn('students', 'education_type');
  await queryInterface.dropAllEnums();
};
