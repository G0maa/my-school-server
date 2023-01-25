import { DataTypes } from 'sequelize';
import { Migration } from '../types';
import { ZBloodGroup, ZGender } from '../validator/general.validator';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('user_details', {
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
    first_name: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM(...Object.values(ZGender.Enum)),
      allowNull: true,
    },
    blood_group: {
      type: DataTypes.ENUM(...Object.values(ZBloodGroup.Enum)),
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    register_date: {
      type: DataTypes.DATEONLY(),
      allowNull: true,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY(),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    updated_at: DataTypes.DATE,
    created_at: DataTypes.DATE,
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('user_details', {});
  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS enum_user_details_gender'
  );
  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS enum_user_details_blood_group'
  );
};
