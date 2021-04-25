import { Sequelize, DataTypes } from 'sequelize';
import { UserInstance } from '../types';

const connectionString = 'postgres://bqgqthbd:9gOdo8uMOO6yQFufa-ypy2bFDW3SgeXz@dumbo.db.elephantsql.com:5432/bqgqthbd';
const sequelize = new Sequelize(connectionString);

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
