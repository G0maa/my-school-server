import { DataTypes } from 'sequelize';
import { Migration } from '../types';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('fees', {
    serial: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.UUID(),
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      allowNull: false,
      references: { model: 'students', key: 'user_id' },
    },
    amount: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    // Supposedly should be an Enum
    fee_type: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATEONLY(),
      allowNull: false,
    },
    is_paid: {
      type: DataTypes.BOOLEAN(),
      defaultValue: false,
      allowNull: true,
    },
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('fees', {});
};
