import {
  Model,
  DataType,
  Table,
  CreatedAt,
  UpdatedAt,
  Column,
  AllowNull,
  PrimaryKey,
  ForeignKey,
  AutoIncrement,
  BelongsTo,
} from 'sequelize-typescript';
import {
  BloodGroup,
  Gender,
  ZBloodGroup,
  ZGender,
} from '../validator/general.validator';
import User from './user';

@Table({
  timestamps: true,
  underscored: true,
  modelName: 'user_details',
})
class UserDetails extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  serial!: number;

  @BelongsTo(() => User, { as: 'user' })
  @ForeignKey(() => User)
  @PrimaryKey
  @AllowNull(false)
  @Column({ type: DataType.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  userId!: string;

  @AllowNull(true)
  @Column(DataType.STRING(64))
  firstName!: string;

  @AllowNull(true)
  @Column(DataType.STRING(64))
  lastName!: string;

  @AllowNull(true)
  @Column(DataType.ENUM(...Object.values(ZGender.enum)))
  gender!: Gender;

  @AllowNull(true)
  @Column(DataType.STRING(20))
  mobile!: string;

  @AllowNull(true)
  @Column
  registerDate!: Date;

  @AllowNull(true)
  @Column
  dateOfBirth!: Date;

  @AllowNull(true)
  @Column(DataType.STRING(64))
  address!: string;

  @AllowNull(true)
  @Column(DataType.ENUM(...Object.values(ZBloodGroup.enum)))
  bloodGroup!: BloodGroup;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

export default UserDetails;
