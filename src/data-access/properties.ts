import { Client } from 'pg';
import { Sequelize } from 'sequelize';

const connectionString = process.env.CONNECTION_STRING;

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
