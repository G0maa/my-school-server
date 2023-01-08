import {
  Model,
  DataType,
  Table,
  Column,
  AllowNull,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  Validate,
} from 'sequelize-typescript';
import ActiveSubject from './activeSubject';
import Student from './student';

@Table({
  timestamps: false,
  underscored: true,
  modelName: 'grades',
})
class Grade extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  serial!: number;

  @AllowNull(false)
  @ForeignKey(() => ActiveSubject)
  @Column({
    type: DataType.INTEGER(),
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  activeSubjectId!: string;

  @AllowNull(false)
  @ForeignKey(() => Student)
  @Column({
    type: DataType.UUID(),
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  studentId!: string;

  @Validate({ min: 0, max: 60 })
  @AllowNull(false)
  @Column(DataType.NUMBER())
  exam!: string;

  @Validate({ min: 0, max: 40 })
  @AllowNull(false)
  @Column(DataType.NUMBER())
  yearWork!: string;

  @BelongsTo(() => Student)
  student!: Student;

  // Revise & Test this
  @BelongsTo(() => ActiveSubject)
  activeSubject!: ActiveSubject;
}

export default Grade;
