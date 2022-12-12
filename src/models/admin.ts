import {
  Table,
  Model,
  DataType,
  Column,
  AllowNull,
  BelongsTo,
  ForeignKey,
  PrimaryKey,
} from 'sequelize-typescript';
import User from './user';

// #Bug, sequelize creates id by default & is autoincremented, that's why tere's PK
@Table({
  timestamps: false,
  underscored: true,
  modelName: 'admin',
})
class Admin extends Model {
  @BelongsTo(() => User, { as: 'user' })
  @ForeignKey(() => User)
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.UUID)
  userId!: string;
}

export default Admin;
