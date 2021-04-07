import express from 'express';
import { User } from '../utils/generateUsers';

export type UserRes = express.Response & {
  user: User;
  notFound: boolean;
};
