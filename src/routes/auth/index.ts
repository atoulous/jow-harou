import { Router } from 'express';

import loginRoutes from './login';
import logoutRoutes from './logout';
import meRoutes from './me';

const router = Router();

router.use('/login', loginRoutes);
router.use('/logout', logoutRoutes);
router.use('/me', meRoutes);

export default router;
