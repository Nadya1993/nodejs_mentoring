import { Client } from 'pg';
import { Sequelize } from 'sequelize';

const connectionString = 'postgres://bqgqthbd:9gOdo8uMOO6yQFufa-ypy2bFDW3SgeXz@dumbo.db.elephantsql.com:5432/bqgqthbd';

export const sequelize = new Sequelize(connectionString);
export const pg = new Client(connectionString);

export const connectSequelize = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
