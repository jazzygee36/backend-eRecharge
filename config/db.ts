import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// const sequelize = new Sequelize('users_db', 'root', 'mesioyesamson!', {
//   host: process.env.HOST,
//   dialect: 'mysql',
//   port: 3306,
//   logging: true, // optional: disable logging
// });

// export default sequelize;

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true, // if SSL is required for the connection
      rejectUnauthorized: false,
    },
  },
});

export default sequelize;
