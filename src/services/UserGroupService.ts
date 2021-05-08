import { ModelCtor } from 'sequelize';
import { sequelize } from '../data-access/properties';
import { GroupModel } from '../models/GroupModel';
import { UserGroupModel } from '../models/UserGroupModel';
import { UserGroupInstance } from '../types';

class UserGroupService {
  private userGroupModel: ModelCtor<UserGroupInstance>;

  constructor (userGroupModel: ModelCtor<UserGroupInstance>) {
    this.userGroupModel = userGroupModel;
  }

  addUsersToGroup = async (groupId: string, userIds: string[]): Promise<UserGroupInstance[] | void> => {
    try {
      return await sequelize.transaction(async (transaction) => {
        const connections = userIds.map((userId) => ({
          groupId,
          userId
        }));
        return await UserGroupModel.bulkCreate(connections, { transaction });
      });
    } catch (error) {
      console.log('Could not commit transaction', error);
    }
  }
}

export const UserGroupServiceInstance = new UserGroupService(UserGroupModel);
