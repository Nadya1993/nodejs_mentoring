import faker from 'faker';
import { v4 as uuidv4 } from 'uuid';
import { UserAttributes } from '../types';

export const generateUsers = (qty: number): UserAttributes[] => (
  Array.from(Array(qty)).map((): UserAttributes => ({
    userId: uuidv4(),
    login: faker.name.firstName(),
    password: faker.lorem.word(7),
    age: faker.datatype.number({
      min: 18,
      max: 99,
    }),
  }))
);
