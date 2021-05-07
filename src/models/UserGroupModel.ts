import { DataTypes } from 'sequelize';
import { sequelize } from '../data-access/properties';
import { UserGroupInstance } from '../types';
import { GroupModel } from './GroupModel';
import { UserModel } from './UserModel';

export const UserGroupModel = sequelize.define<UserGroupInstance>('user_groups', {
  userId: {
    type: DataTypes.UUIDV4,
    allowNull: false,
    references: {
      model: UserModel,
      key: 'user_id'
    }
  },
  groupId: {
    type: DataTypes.UUIDV4,
    allowNull: false,
    references: {
      model: GroupModel,
      key: 'group_id'
    }
  }
}, {
  underscored: true
});

UserModel.belongsToMany(GroupModel, { through: UserGroupModel });
GroupModel.belongsToMany(UserModel, { through: UserGroupModel });
