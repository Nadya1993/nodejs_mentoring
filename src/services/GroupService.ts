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

  getGroups = async (): Promise<GroupAttributes[]> => (
    await this.groupModel.findAll({
      attributes: ['name', 'permission', 'group_id'],
      include: UserModel
    })
  )

  findGroup = async (id: string): Promise<GroupAttributes | undefined> => (
    await this.groupModel.findByPk(id, {
      attributes: ['name', 'permission', 'group_id']
    })
  )

  addGroup = async (name: string, permission: Permission[]): Promise<GroupInstance> => (
    await this.groupModel.create({ groupId: uuidv4(), name, permission })
  )

  deleteGroup = async (groupId: string): Promise<number> => (
    await this.groupModel.destroy({
      where: {
        groupId
      }
    })
  )

  updateGroup = async ({ groupId, name, permission }: GroupAttributes): Promise<[number, GroupInstance[]]> => (
    await this.groupModel.update({ name, permission }, {
      where: {
        groupId
      }
    })
  )
}

export const GroupServiceInstance = new GroupService(GroupModel);
