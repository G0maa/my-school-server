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
  modelName: 'study_class',
})
class StudyClass extends Model {
  @PrimaryKey
  @Column(DataType.STRING(6))
  classId!: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(Class)))
  class!: Class;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(EducationTypes)))
  educationType!: EducationTypes;
}

export default StudyClass;
