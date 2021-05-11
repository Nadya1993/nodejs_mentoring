import { GroupModel } from '../../models/GroupModel';
import { connectSequelize, pg } from '../properties';

import { v4 as uuidv4 } from 'uuid';
import { Permission } from '../../types';

const createGroupsTable = async () => {
  await pg.connect();
  await pg.query('DROP TABLE IF EXISTS groups;');
  await pg.query(`CREATE TABLE groups (
    group_id varchar(40) PRIMARY KEY,
    name varchar(40) NOT NULL,
    permission varchar(100),
    created_at timestamp,
    updated_at timestamp );`
  );
  await pg.end();
  connectSequelize().then(async () => {
    const groups = [
      {
        groupId: uuidv4(),
        name: 'ADMIN',
        permission: [Permission.Read, Permission.Write, Permission.Delete, Permission.Share, Permission.Upload]
      },
      {
        groupId: uuidv4(),
        name: 'SUPPORT',
        permission: [Permission.Read, Permission.Write, Permission.Share, Permission.Upload]
      },
      {
        groupId: uuidv4(),
        name: 'USER',
        permission: [Permission.Read, Permission.Share]
      }
    ];
    await GroupModel.bulkCreate(groups);
  }, (err) => {
    console.log(err);
  });
}

createGroupsTable();
