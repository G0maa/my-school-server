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
import { ZFeePaymentType, ZFeeStatus } from '../validator/fee.validator';
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

  @AllowNull(true)
  @Default(ZFeeStatus.enum.Pending)
  @Column(DataType.ENUM(...Object.values(ZFeeStatus.enum)))
  status!: ZFeeStatus;

  @AllowNull(true)
  @Column(DataType.ENUM(...Object.values(ZFeePaymentType.enum)))
  paymentType!: ZFeePaymentType;

  // In consistent, if underscored is true,
  // then targetKey should be also underscored i.e. user_id
  @BelongsTo(() => Student, { targetKey: 'userId' })
  student!: Student;
}

export default Fee;
