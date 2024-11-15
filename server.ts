import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import sequelize from './config/db';
import UserRouter from './modules/userAuth/router';
import paymentRoutes from './modules/payment/route';
import utilityRoute from './modules/utilities/router';
import userProfile from './modules/profile/route';
// import morgan from 'morgan';

const Port = process.env.PORT || 1000;
const app = express();

// Middleware
app.use(cors());
// app.use(morgan('dev'));
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

//Routers
app.use('/api', UserRouter);
app.use('/api', paymentRoutes);
app.use('/api', utilityRoute);
app.use('/api', userProfile);

// Database connection check
(sequelize.query('SELECT 1') as unknown as Promise<any>)
  .then(() => {
    console.log('Connected to DB');
    // app.listen(Port, () => {
    //   console.log(`Server is running on port ${Port}`);
    // });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });
