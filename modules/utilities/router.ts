import express, { RequestHandler } from 'express';
import { paymentCallback, payTopUp } from './controller';
const router = express.Router();

// router.get('/providers', getProviders as RequestHandler);

router.get('/payment-callback', paymentCallback as RequestHandler);
router.post('/pay-topup', payTopUp as unknown as RequestHandler);

export default router;
