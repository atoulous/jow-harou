import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Jow RA Hou',
    documentation: '/swagger',
    version: '1.0.0',
  });
});

export default router;
