import {
  Model,
  DataType,
  Table,
  Column,
  AllowNull,
  PrimaryKey,
} from 'sequelize-typescript';
import { Class, EducationTypes } from '../types';

@Table({
  timestamps: false,
  underscored: true,
  modelName: 'subject',
})
class Subject extends Model {
  @PrimaryKey
  @Column(DataType.STRING(6))
  subjectId!: string;

  @AllowNull(true)
  @Column(DataType.STRING(64))
  name!: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(Class)))
  class!: Class;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(EducationTypes)))
  educationType!: EducationTypes;
}

export default Subject;
