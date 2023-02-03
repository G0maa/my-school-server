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
import { ZRole } from '../validator/general.validator';
import Admin from './admin';
import Student from './student';
import Teacher from './teacher';
import UserDetails from './userDetails';

@Table({
  timestamps: true,
  underscored: true,
  modelName: 'user',
})
class User extends Model {
  // Note: Associations point mainly to this PK
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(true)
  @Unique(true)
  @IsEmail
  @Column(DataType.STRING(64))
  email!: string;

  // Note: Usernames are generated on code-level
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

  // Relations
  @HasOne(() => UserDetails)
  userDetails!: UserDetails;

  @HasOne(() => Student)
  student!: Student;

  @HasOne(() => Admin)
  admin!: Admin;

  @HasOne(() => Teacher)
  teacher!: Teacher;

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
