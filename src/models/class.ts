import {
  Model,
  DataType,
  Table,
  Column,
  AllowNull,
  PrimaryKey,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { Class, EducationTypes } from '../types';
import ActiveSubject from './activeSubject';
import Student from './student';
import Subject from './subject';
import Teacher from './teacher';

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

  @BelongsToMany(() => Subject, () => ActiveSubject)
  subjects!: Subject[];

  @BelongsToMany(() => Teacher, () => ActiveSubject)
  teachers!: Teacher[];

  @HasMany(() => Student)
  students!: Student[];
}

export default StudyClass;
