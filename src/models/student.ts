import {
  Model,
  DataType,
  Table,
  Column,
  BelongsTo,
  Default,
  ForeignKey,
  AllowNull,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { Class } from '../types';

import User from './user';

// class, parentName, parentPhoneNumber
@Table({
  timestamps: false,
  underscored: true,
  modelName: 'student',
  // initialAutoIncrement: '1', Doesn't exist on sequelize
})
class Student extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  serial!: number;

  @ForeignKey(() => User) // is this needed?
  @BelongsTo(() => User, { as: 'user' }) // student
  @Default(DataType.UUIDV4) // to allow creation on this side.
  @Column(DataType.UUID)
  userId!: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(Class)))
  class!: Class;

  @AllowNull(true)
  @Column(DataType.STRING(64))
  parentName!: string;

  @AllowNull(true)
  @Column(DataType.STRING(16))
  parentPhonenumber!: string;
}

export default Student;
