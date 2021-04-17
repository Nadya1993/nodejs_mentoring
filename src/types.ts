import express from 'express';
import { User } from './models/UserModel';

export type UserRes = express.Response & {
  user: User;
  notFound: boolean;
};
