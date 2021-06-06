import express from 'express';
import { authenticate, refreshToken, checkToken } from './controllers/authControllers';

const router = express.Router();

// authenticate user
router.post('/', authenticate);

// refresh token
router.post('/refresh', checkToken, refreshToken);

export default router;
