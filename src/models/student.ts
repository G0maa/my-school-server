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
  HasMany,
} from 'sequelize-typescript';
import {
  EducationType,
  StudyYear,
  ZEducationType,
  ZStudyYear,
} from '../validator/general.validator';
import StudyClass from './class';
import Fee from './fee';
import Grade from './grade';

import User from './user';

// class, parentName, parentPhoneNumber
@Table({
  timestamps: false,
  underscored: true,
  modelName: 'student',
})
class Student extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  serial!: number;

  @ForeignKey(() => User)
  @Default(DataType.UUIDV4) // to allow creation on this side.
  @Column({ type: DataType.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  userId!: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(ZStudyYear.Enum)))
  studyYear!: StudyYear;

  @AllowNull(true)
  @Column(DataType.ENUM(...Object.values(ZEducationType.Enum)))
  educationType!: EducationType;

  @AllowNull(true)
  @Column(DataType.STRING(64))
  parentName!: string;

  @AllowNull(true)
  @Column(DataType.STRING(16))
  parentPhonenumber!: string;

  @ForeignKey(() => StudyClass)
  @Column({
    type: DataType.STRING(6),
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  classId!: string;

  // Relations
  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => Fee)
  fees!: Fee[];

  @HasMany(() => Grade)
  grades!: Grade[];
}

export default Student;
