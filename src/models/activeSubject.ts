import {
  Model,
  DataType,
  Table,
  Column,
  AllowNull,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import StudyClass from './class';
import Grade from './grade';
import Subject from './subject';
import Teacher from './teacher';

@Table({
  timestamps: false,
  underscored: true,
  modelName: 'active_subject',
})
class ActiveSubject extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  serial!: number;

  @ForeignKey(() => StudyClass)
  @Column({
    type: DataType.STRING(6),
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  classId!: string;

  @ForeignKey(() => Subject)
  @Column({
    type: DataType.STRING(6),
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  subjectId!: string;

  @ForeignKey(() => Teacher)
  @Column({ type: DataType.UUID(), onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  teacherId!: string;

  @AllowNull(false)
  @Column(DataType.STRING(6))
  subjectSchedule!: string;

  // Relations
  @HasMany(() => Grade)
  studentGrades!: Grade[];

  // Do not do this, this is the 'connecting' table
  // @BelongsTo(() => Teacher)...
}

export default ActiveSubject;
