import express from 'express';
import { Model } from 'sequelize';

export interface UserAttributes {
  userId: string;
  login: string;
  password: string;
  age: number;
}

export interface UserInstance
  extends Model<UserAttributes>,
    UserAttributes {}

export type UserRes = express.Response & {
  user: UserAttributes;
};

export enum Permission {
  Read = 'READ',
  Write = 'WRITE',
  Delete = 'DELETE',
  Share = 'SHARE',
  Upload = 'UPLOAD_FILES'
};

export interface GroupAttributes {
  groupId: string;
  name: string;
  permission: Permission[];
}

export interface GroupInstance
extends Model<GroupAttributes>,
GroupAttributes {}

export type GroupRes = express.Response & {
  group: GroupAttributes;
};

export interface UserGroupAttributes {
  userId: string;
  groupId: string;
}

export interface UserGroupInstance
  extends Model<UserGroupAttributes>,
    UserGroupAttributes {}
