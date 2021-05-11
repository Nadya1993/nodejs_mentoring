import { pg } from '../properties';

const createUserGroupTable = async () => {
  await pg.connect();
  await pg.query('DROP TABLE IF EXISTS user_groups;');
  await pg.query(`CREATE TABLE user_groups (
    user_user_id varchar(40) REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    group_group_id varchar(40) REFERENCES "groups" ("group_id") ON DELETE CASCADE ON UPDATE CASCADE,
    created_at timestamp,
    updated_at timestamp,
    PRIMARY KEY ("user_user_id", "group_group_id"));`
  );
  await pg.end();
}

createUserGroupTable();
