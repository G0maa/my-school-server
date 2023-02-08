import {
  Table,
  Model,
  DataType,
  Column,
  AllowNull,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  Default,
} from 'sequelize-typescript';
import Student from './student';

@Table({
  timestamps: false,
  underscored: true,
  modelName: 'fees',
})
class Fee extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  serial!: number;

  @ForeignKey(() => Student)
  @AllowNull(false)
  @Column({ type: DataType.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  studentId!: string;

  @AllowNull(false)
  @Column(DataType.STRING(32))
  feeType!: string;

  @AllowNull(false)
  @Column
  amount!: number;

  @AllowNull(false)
  @Column
  dueDate!: Date;

  @AllowNull(false)
  @Default(false)
  @Column
  isPaid!: boolean;

  // Relations
  @BelongsTo(() => Student)
  student!: Student;
}

export default Fee;
