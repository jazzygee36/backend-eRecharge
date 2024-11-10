// api/utility.ts
// import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import express, { Request, Response } from 'express';
import utilityRoute from '../modules/utilities/router';
import sequelize from '../config/db';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', utilityRoute);

sequelize
  .query('SELECT 1')
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });

export default function handler(req: Request, res: Response) {
  return app(req, res);
}
