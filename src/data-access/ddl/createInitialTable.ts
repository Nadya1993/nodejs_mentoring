import { UserModel } from '../../models/UserModel';
import { generateUsers } from '../../utils/generateUsers';
import { connectSequelize, pg } from '../properties';

const createInitialTable = async (qty: number) => {
  await pg.connect();
  await pg.query('DROP TABLE users;');
  await pg.query(`CREATE TABLE users (
    user_id varchar(40) PRIMARY KEY,
    login varchar(40) NOT NULL,
    password varchar(40) NOT NULL,
    age integer NOT NULL,
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp );`
  );
  await pg.end();
  connectSequelize().then(async () => {
    const users = generateUsers(qty)
    await UserModel.bulkCreate(users);
  }, (err) => {
    console.log(err);
  });
}

createInitialTable(7);
