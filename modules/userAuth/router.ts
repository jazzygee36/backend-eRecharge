import express, { RequestHandler } from 'express';
import {
  registerUsers,
  verifyEmail,
  loginUser,
  requestPasswordReset,
  resetPassword,
} from './controller';
const router = express.Router();

router.post('/register', registerUsers as unknown as RequestHandler);
router.get('/verify-email/:token', verifyEmail as unknown as RequestHandler);
router.post('/login', loginUser as unknown as RequestHandler);
// reset password
router.post(
  '/request-password-reset',
  requestPasswordReset as unknown as RequestHandler
);
router.get(
  '/reset-password/:token',
  resetPassword as unknown as RequestHandler
);

export default router;
