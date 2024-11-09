import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize('users_db', 'root', 'mesioyesamson!', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  logging: false, // optional: disable logging
});

export default sequelize;
