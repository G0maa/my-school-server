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
  BeforeCreate,
} from 'sequelize-typescript';
import { Role } from '../types';
import {
  generateRandomPassword,
  generateSerialUsername,
} from '../utils/helpers';
import Admin from './admin';
// import Student from './student';
// import { sequelize } from '../utils/db';
// import { Role } from '../types';
// import Admin from './admin';
import Student from './student';

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
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(true)
  @Column(DataType.STRING(64))
  name!: string;

  @AllowNull(true)
  @Unique(true)
  @IsEmail
  @Column(DataType.STRING(64))
  email!: string;

  // Note: we generate usernames on code-level
  @AllowNull(false)
  @Column(DataType.STRING(5))
  username!: string;

  @AllowNull(false)
  @Column(DataType.STRING(64))
  password!: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(Role)))
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

  @BeforeCreate
  static createRecord = (instance: User) => {
    if (instance.role === Role.Student) {
      instance.username = generateSerialUsername();
      instance.password = generateRandomPassword();
    }
  };
}

export default User;
