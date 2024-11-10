import express, { RequestHandler } from 'express';
import { getUserProfile } from './controller';
const router = express.Router();

router.get('/user-profile', getUserProfile as unknown as RequestHandler);

export default router;
