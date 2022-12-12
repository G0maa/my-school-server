import {
  Model,
  DataType,
  Column,
  Default,
  Table,
  PrimaryKey,
  AllowNull,
} from 'sequelize-typescript';

// We may need to use timestamps here, for deubgging purposes.
@Table({
  timestamps: false,
  underscored: true,
  modelName: 'var',
})
class Var extends Model {
  @PrimaryKey
  @Column(DataType.STRING(24))
  varName!: string;

  @AllowNull(false)
  @Default(1)
  @Column(DataType.INTEGER)
  value!: number;
}

export default Var;
