import { Model, DataTypes, HasOneCreateAssociationMixin } from 'sequelize';
import { Class } from '../types';
import { sequelize } from '../utils/db';
import User from './user';

// class, parentName, parentPhoneNumber
class Student extends Model {
  declare createUser: HasOneCreateAssociationMixin<User>;
}
Student.init(
  {
    userId: {
      type: DataTypes.UUID(),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
      primaryKey: true,
      references: { model: 'users', key: 'user_id' },
    },
    class: {
      type: DataTypes.ENUM(...Object.values(Class)),
      allowNull: true,
    },
    parentName: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    parentPhonenumber: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'student',
  }
);

export default Student;
