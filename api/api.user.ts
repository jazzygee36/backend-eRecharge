import express from 'express';

const app = express();
import UserRouter from '../modules/userAuth/router';

app.use('/api', UserRouter);
