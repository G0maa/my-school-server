import {
  Table,
  Model,
  DataType,
  Column,
  AllowNull,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({
  timestamps: false,
  underscored: true,
  modelName: 'holidays',
})
class Holiday extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  serial!: number;

  @AllowNull(false)
  @Column(DataType.STRING(32))
  name!: string;

  @AllowNull(false)
  @Column
  startDate!: Date;

  @AllowNull(false)
  @Column
  endDate!: Date;
}

export default Holiday;
