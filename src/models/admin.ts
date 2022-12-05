import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../utils/db';

class Admin extends Model {}
Admin.init(
  {
    userId: {
      type: DataTypes.UUID(),
      allowNull: false,
      primaryKey: true,
      references: { model: 'users', key: 'user_id' },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'admin',
  }
);

export default Admin;
