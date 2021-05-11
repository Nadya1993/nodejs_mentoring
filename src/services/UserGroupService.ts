import { ModelCtor } from 'sequelize';
import { sequelize } from '../data-access/properties';
import { UserGroupModel } from '../models/UserGroupModel';
import { UserGroupInstance } from '../types';

class UserGroupService {
  private userGroupModel: ModelCtor<UserGroupInstance>;

  constructor (userGroupModel: ModelCtor<UserGroupInstance>) {
    this.userGroupModel = userGroupModel;
  }

  addUsersToGroup = async (groupGroupId: string, userIds: string[]): Promise<UserGroupInstance[] | void> => {
    try {
      return await sequelize.transaction(async (transaction) => {
        const connections = userIds.map((userUserId) => ({
          groupGroupId,
          userUserId
        }));

        return await this.userGroupModel.bulkCreate(connections, { transaction });
      });
    } catch (error) {
      console.log('Could not commit transaction', error);
    }
  }
}

export const UserGroupServiceInstance = new UserGroupService(UserGroupModel);
