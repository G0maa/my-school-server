import {
  Table,
  Model,
  DataType,
  Column,
  AllowNull,
  BelongsTo,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import User from './user';

// #Bug, sequelize creates id by default & is autoincremented, that's why tere's PK
@Table({
  timestamps: false,
  underscored: true,
  modelName: 'admin',
})
class Admin extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  serial!: number;

  @BelongsTo(() => User, { as: 'user' })
  @ForeignKey(() => User)
  @PrimaryKey
  @AllowNull(false)
  @Column({ type: DataType.UUID, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
  userId!: string;
}

export default Admin;
