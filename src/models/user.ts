import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../utils/db';
import { Role } from '../types';

class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.UUID(),
      defaultValue: DataTypes.UUIDV4(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(Role)),
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN(),
      defaultValue: false,
    },
    isReset: {
      type: DataTypes.BOOLEAN(),
      defaultValue: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'user',
  }
);

export default User;
