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
import {
  EducationType,
  StudyYear,
  ZEducationType,
  ZStudyYear,
} from '../validator/general.validator';
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
  @Column(DataType.ENUM(...Object.values(ZStudyYear.Enum)))
  studyYear!: StudyYear;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(ZEducationType.enum)))
  educationType!: EducationType;

  // Relations
  @BelongsToMany(() => Subject, () => ActiveSubject)
  subjects!: Subject[];

  @BelongsToMany(() => Teacher, () => ActiveSubject)
  teachers!: Teacher[];

  @HasMany(() => Student)
  students!: Student[];
}

export default StudyClass;
