import { DataTypes } from 'sequelize';
import { sequelize } from '../data-access/properties';
import { UserInstance } from '../types';

export const UserModel = sequelize.define<UserInstance>('user', {
  userId: {
    primaryKey: true,
    type: DataTypes.STRING
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.NUMBER,
    allowNull: false
  }
}, {
  underscored: true,
  paranoid: true
});
