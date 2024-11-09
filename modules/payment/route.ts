import express, { RequestHandler } from 'express';
import { verifyFunding } from './controller';

const router = express.Router();

router.post('/verify-payment', verifyFunding as unknown as RequestHandler);

export default router;
