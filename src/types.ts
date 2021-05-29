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

export interface UserGroupAttributes {
  userUserId: string;
  groupGroupId: string;
}

export interface UserGroupInstance
  extends Model<UserGroupAttributes>,
    UserGroupAttributes {}

export enum severityLevel {
  debug = 'debug',
  info = 'info',
  warn = 'warn',
  error = 'error',
};
