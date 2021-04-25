import express from 'express';
import { Model } from 'sequelize';
export interface UserAttributes {
  userId: string;
  login: string;
  password: string;
  age: number;
}

// interface UserModificationAttributes
//   extends Optional<UserAttributes, 'login' | 'password' | 'age' | 'deletedAt'> {}

export interface UserInstance
  extends Model<UserAttributes>,
    UserAttributes {}

export type UserRes = express.Response & {
  user: UserAttributes;
};
