import { DataTypes } from 'sequelize';
import { sequelize } from '../data-access/properties';
import {
  GroupInstance,
  Permission
} from '../types';

export const GroupModel = sequelize.define<GroupInstance>('group', {
  groupId: {
    primaryKey: true,
    type: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  permission: {
    type: DataTypes.ENUM(
      Permission.Read,
      Permission.Write,
      Permission.Delete,
      Permission.Share,
      Permission.Upload
    )
  }
}, {
  underscored: true
});
