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

import User from './user';

@Table({
  timestamps: false,
  underscored: true,
  modelName: 'teacher',
})
class Teacher extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  serial!: number;

  @ForeignKey(() => User) // is this needed?
  @BelongsTo(() => User, { as: 'user' }) // student
  @Default(DataType.UUIDV4) // to allow creation on this side.
  @Column(DataType.UUID)
  userId!: string;

  @AllowNull(true)
  @Column(DataType.STRING(64))
  education!: string;

  @AllowNull(true)
  @Column(DataType.STRING(64))
  department!: string;
}

export default Teacher;
