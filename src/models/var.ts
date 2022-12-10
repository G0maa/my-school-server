import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '../utils/db';

class Var extends Model<InferAttributes<Var>, InferCreationAttributes<Var>> {
  declare varName: string;
  declare value: CreationOptional<number>;
}
Var.init(
  {
    varName: {
      type: DataTypes.STRING(24),
      primaryKey: true,
    },
    value: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'var',
  }
);

export default Var;
