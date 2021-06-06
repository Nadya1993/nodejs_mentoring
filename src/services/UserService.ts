import { ModelCtor, Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { UserModel } from '../models/UserModel';
import { UserAttributes, UserInstance } from '../types';

class UserService {
  private userModel: ModelCtor<UserInstance>;

  constructor (userModel: ModelCtor<UserInstance>) {
    this.userModel = userModel;
  }

  async getUsers (): Promise<UserAttributes[]> {
    return (
      await this.userModel.findAll({
        attributes: ['login', 'password', 'age', 'user_id']
      })
    )
  }

  async findUser (userId: string): Promise<UserAttributes | undefined> {
    return (
      await (await this.userModel.findByPk(userId, {
        attributes: ['login', 'password', 'age', 'user_id']
      }))
    )
  }

  async findUserByLogin (login: string): Promise<UserAttributes | undefined> {
    return (
      await (await this.userModel.findOne({
        where: { login }
      }))
    )
  }

  async addUser (login: string, password: string, age: number): Promise<UserInstance> {
    return (
      await this.userModel.create({ userId: uuidv4(), login, password, age })
    )
  }

  async deleteUser (userId: string): Promise<number> {
    return (
      await this.userModel.destroy({
        where: {
          userId
        }
      })
    )
  }

  async updateUser ({ userId, login, password, age }: UserAttributes): Promise<[number, UserInstance[]]> {
    return (
      await this.userModel.update({ login, password, age }, {
        where: {
          userId
        }
      })
    )
  }

  async getSuggestionList (limit: number, loginSubstring: string): Promise<UserAttributes[]> {
    return (
      await this.userModel.findAll({
        attributes: ['login', 'password', 'age', 'user_id'],
        where: {
          login: {
            [Op.like]: `${loginSubstring}%`
          }
        },
        order: ['login'],
        limit
      })
    )
  }
}

export const UserServiceInstance = new UserService(UserModel);
