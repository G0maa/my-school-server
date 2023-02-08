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
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import ActiveSubject from './activeSubject';
import StudyClass from './class';
import Subject from './subject';
import SubjectsMaterial from './subjectsMaterial';

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

  @ForeignKey(() => User)
  @Default(DataType.UUIDV4) // to allow creation on this side.
  @Column({ type: DataType.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  userId!: string;

  @AllowNull(true)
  @Column(DataType.STRING(64))
  education!: string;

  @AllowNull(true)
  @Column(DataType.STRING(64))
  department!: string;

  // Relations
  @BelongsTo(() => User)
  user!: User;

  @BelongsToMany(() => StudyClass, () => ActiveSubject)
  studyClasses!: StudyClass[];

  @BelongsToMany(() => Subject, () => ActiveSubject)
  subjects!: Subject[];

  @HasMany(() => SubjectsMaterial)
  subjectsMaterials!: SubjectsMaterial[];
}

export default Teacher;
