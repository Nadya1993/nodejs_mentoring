import { ModelCtor } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { GroupModel } from '../models/GroupModel';
import { UserModel } from '../models/UserModel';
import { GroupAttributes, GroupInstance, Permission } from '../types';

class GroupService {
  private groupModel: ModelCtor<GroupInstance>;

  constructor (groupModel: ModelCtor<GroupInstance>) {
    this.groupModel = groupModel;
  }

  async getGroups (): Promise<GroupAttributes[]> {
    return (
      await this.groupModel.findAll({
        attributes: ['name', 'permission', 'group_id'],
        include: UserModel
      })
    )
  }

  async findGroup (id: string): Promise<GroupAttributes | undefined> {
    return (
      await this.groupModel.findByPk(id, {
        attributes: ['name', 'permission', 'group_id']
      })
    )
  }

  async addGroup (name: string, permission: Permission[]): Promise<GroupInstance> {
    return (
      await this.groupModel.create({ groupId: uuidv4(), name, permission })
    )
  }

  async deleteGroup (groupId: string): Promise<number> {
    return (
      await this.groupModel.destroy({
        where: {
          groupId
        }
      })
    )
  }

  async updateGroup ({
    groupId,
    name,
    permission
  }: GroupAttributes): Promise<[number, GroupInstance[]]> {
    return (
      await this.groupModel.update({ name, permission }, {
        where: {
          groupId
        }
      })
    )
  }
}

export const GroupServiceInstance = new GroupService(GroupModel);
