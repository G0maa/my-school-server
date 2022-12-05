import { Model, DataTypes, HasOneCreateAssociationMixin } from 'sequelize';
import { sequelize } from '../utils/db';
import { Role } from '../types';
import Admin from './admin';

class User extends Model {
  declare createAdmin: HasOneCreateAssociationMixin<Admin>;
}
User.init(
  {
    id: {
      type: DataTypes.UUID(),
      defaultValue: DataTypes.UUIDV4(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    username: {
      type: DataTypes.STRING(5), // Make it six for good measures? :D
      allowNull: false,
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
