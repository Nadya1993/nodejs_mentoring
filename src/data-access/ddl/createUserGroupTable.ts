import { connectSequelize, pg } from '../properties';

import { UserGroupModel } from '../../models/UserGroupModel';

const createUserGroupTable = async () => {
  await pg.connect();
  await pg.query('DROP TABLE IF EXISTS user_groups;');
  await pg.query(`CREATE TABLE user_groups (
    user_id varchar(40) REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    group_id varchar(40) REFERENCES "groups" ("group_id") ON DELETE CASCADE ON UPDATE CASCADE,
    created_at timestamp,
    updated_at timestamp,
    UNIQUE user_user_id,
    PRIMARY KEY ("user_id","group_id"));`
  );
  await pg.end();
  connectSequelize().then(async () => {
    const connections = [
      {
        groupId: '92894288-4ae4-41dc-8513-4ad04264fb99',
        userId: '97d1dae7-6143-4ec3-b218-e3e1eb887906'
      },
      {
        groupId: '92894288-4ae4-41dc-8513-4ad04264fb99',
        userId: 'ba40f2aa-2045-4ea2-9c53-de0ed3ad6b45'
      }
    ];
    await UserGroupModel.bulkCreate(connections);
  }, (err) => {
    console.log(err);
  });
}

createUserGroupTable();
