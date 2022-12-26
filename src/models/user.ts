import {
  Model,
  DataType,
  Table,
  CreatedAt,
  UpdatedAt,
  Column,
  AllowNull,
  PrimaryKey,
  Default,
  Unique,
  IsEmail,
  HasOne,
  BeforeValidate,
} from 'sequelize-typescript';
import { Role } from '../validator/general.validator';
import {
  generateRandomPassword,
  generateSerialUsername,
} from '../utils/helpers';
import {
  BloodGroup,
  Gender,
  ZBloodGroup,
  ZGender,
  ZRole,
} from '../validator/general.validator';
import Admin from './admin';
import Student from './student';
import Teacher from './teacher';

// id, name, email, username, password, role, isVerified, isReset
@Table({
  timestamps: true,
  underscored: true,
  modelName: 'user',
})
class User extends Model {
  @PrimaryKey
  @HasOne(() => Student, { as: 'student' })
  @HasOne(() => Admin, { as: 'admin' })
  @HasOne(() => Teacher, { as: 'teacher' })
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

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

  @AllowNull(true)
  @Unique(true)
  @IsEmail
  @Column(DataType.STRING(64))
  email!: string;

  // Note: we generate usernames on code-level
  @AllowNull(false)
  @Unique(true)
  @Column(DataType.STRING(5))
  username!: string;

  @AllowNull(false)
  @Column(DataType.STRING(64))
  password!: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(ZRole.enum)))
  role!: Role;

  @Default(false)
  @Column
  isVerified!: boolean;

  @Default(false)
  @Column
  isReset!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BeforeValidate
  static assignUsernamePassword = async (instance: User) => {
    if (!instance.username) {
      const tableName = instance.role.toLowerCase().concat('s');

      instance.username = await generateSerialUsername(tableName);
      instance.password = generateRandomPassword();
    }
  };
}

export default User;
