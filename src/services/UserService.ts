import { ModelCtor, Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { UserAttributes, UserInstance } from '../types';

export class UserService {
  private userModel: ModelCtor<UserInstance>;

  constructor (userModel: ModelCtor<UserInstance>) {
    this.userModel = userModel;
  }

  getUsers = async (): Promise<UserAttributes[]> => (
    await this.userModel.findAll({
      attributes: ['login', 'password', 'age', 'user_id']
    })
  )

  findUser = async (userId: string): Promise<UserAttributes | undefined> => (
    await (await this.userModel.findByPk(userId, {
      attributes: ['login', 'password', 'age', 'user_id']
    }))
  )

  addUser = async (login: string, password: string, age: number): Promise<UserInstance> => (
    await this.userModel.create({ userId: uuidv4(), login, password, age })
  )

  deleteUser = async (userId: string): Promise<number> => (
    await this.userModel.destroy({
      where: {
        userId
      }
    })
  )

  updateUser = async ({ userId, login, password, age }: UserAttributes): Promise<[number, UserInstance[]]> => (
    await this.userModel.update({ login, password, age }, {
      where: {
        userId
      }
    })
  )

  getSuggestionList = async (limit: number, loginSubstring: string): Promise<UserAttributes[]> => (
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
