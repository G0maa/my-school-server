import {
  Model,
  DataTypes,
  HasOneCreateAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '../utils/db';
import { Role } from '../types';
import Admin from './admin';
import Student from './student';

// id, name, email, username, password, role, isVerified, isReset
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: CreationOptional<string>;
  declare email: CreationOptional<string>;
  declare username: string;
  declare password: string;
  declare role: Role;
  declare isVerified: CreationOptional<boolean>;
  declare isReset: CreationOptional<boolean>;

  declare createAdmin: HasOneCreateAssociationMixin<Admin>;
  declare createStudent: HasOneCreateAssociationMixin<Student>;
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
