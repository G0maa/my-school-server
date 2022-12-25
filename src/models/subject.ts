import {
  Model,
  DataType,
  Table,
  Column,
  AllowNull,
  PrimaryKey,
  BelongsToMany,
} from 'sequelize-typescript';
import { Class, EducationTypes } from '../types';
import ActiveSubject from './activeSubject';
import StudyClass from './class';
import Teacher from './teacher';

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

  @BelongsToMany(() => StudyClass, () => ActiveSubject)
  studyClasses!: StudyClass[];

  @BelongsToMany(() => Teacher, () => ActiveSubject)
  teachers!: Teacher[];
}

export default Subject;
