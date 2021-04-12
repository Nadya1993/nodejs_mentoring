import faker from 'faker';
import { v4 as uuidv4 } from 'uuid';

type GeneralProperties = {
  id: string;
  login: string;
  password: string;
  age: number;
}

export type User = GeneralProperties & {
  isDeleted: boolean;
}

export class UserManager {
  private users: User[];

  private generateUsers = (qty: number): User[] => {
    return Array.from(Array(qty)).map(() => {
      return {
        id: uuidv4(),
        login: faker.name.firstName(),
        password: faker.lorem.word(),
        age: faker.datatype.number({
          min: 18,
          max: 99
        }),
        isDeleted: faker.datatype.boolean()
      }
    })
  }

  constructor (qty: number) {
    this.users = this.generateUsers(qty);
  }

  getVisibleUsers = (): User[] => this.users.filter((user: User) => !user.isDeleted);

  findUser = (userId: string): User | undefined =>
    this.getVisibleUsers().find((user: User) => user.id === userId);

  addUser = (login: string, password: string, age: number): void => {
    this.users = [{
      id: uuidv4(),
      login: String(login),
      password: String(password),
      age: Number(age),
      isDeleted: false
    },
    ...this.users]
  }

  deleteUser = (id: string): boolean => {
    let isUserDeleted = false;
    this.users = this.users.map((user: User) => {
      if (user.id === id) {
        user = {
          ...user,
          isDeleted: true
        };
        isUserDeleted = true;
      }

      return user;
    });

    return isUserDeleted;
  }

  updateUser = ({ id, login, password, age }: GeneralProperties): void => {
    this.users = this.users.map((user: User) => {
      if (user.id === id) {
        user = {
          ...user,
          login,
          password,
          age
        };
      }
      return user;
    });
  }

  getSuggestionList = (limit: number, loginSubstring: string): User[] => {
    const suggestionList = this.getVisibleUsers()
      .reduce((result: User[], user: User) => {
        if (user.login.includes(String(loginSubstring))) {
          result.push(user);
        }
        return result
      }, [])
      .sort((a, b) => a.login.localeCompare(b.login))
      .slice(0, Number(limit) - 1);

    return suggestionList;
  }
}
