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
import StudyClass from './class';
import SubjectsMaterial from './subjectsMaterial';
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
  @Column(DataType.ENUM(...Object.values(ZStudyYear.enum)))
  studyYear!: StudyYear;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(ZEducationType.Enum)))
  educationType!: EducationType;

  // Relations
  @BelongsToMany(() => StudyClass, () => ActiveSubject)
  studyClasses!: StudyClass[];

  @BelongsToMany(() => Teacher, () => ActiveSubject)
  teachers!: Teacher[];

  @HasMany(() => SubjectsMaterial)
  subjectMaterial!: SubjectsMaterial[];
}

export default Subject;
