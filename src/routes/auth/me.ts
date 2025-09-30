import { Router } from 'express';

import jwtService from '../../services/jwtService';
import houraService from '../../services/rahouService';
import sessionService from '../../services/sessionService';

const router = Router();

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user
 *     description: Get current user information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   description: User details from Rahou
 *       401:
 *         description: Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const jwtToken = authHeader && authHeader.split(' ')[1];

    if (!jwtToken) {
      return res.status(401).json({
        error: 'JWT token required for getMe',
        code: 401,
        timestamp: new Date().toISOString(),
      });
    }

    // Verify JWT token and extract Rahou token
    const payload = jwtService.verifyToken(jwtToken);
    if (!payload) {
      return res.status(401).json({
        error: 'Invalid or expired JWT token',
        code: 401,
        timestamp: new Date().toISOString(),
      });
    }

    // Get the stored session using Rahou token
    const session = sessionService.getSessionByToken(payload.rahouToken);
    if (!session) {
      return res.status(401).json({
        error: 'Session not found',
        code: 401,
        timestamp: new Date().toISOString(),
      });
    }

    // Use session to get user info
    const user = await houraService.getMe(session);

    if (user) {
      res.json({
        success: true,
        user: user,
      });
    } else {
      res.status(401).json({
        error: 'Invalid or expired Rahou token',
        code: 401,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 500,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
