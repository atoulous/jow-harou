import { Router } from 'express';

import jwtService from '../../services/jwtService';
import houraService from '../../services/rahouService';
import sessionService from '../../services/sessionService';

const router = Router();

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logout user and invalidate session
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
 *                 sessionId:
 *                   type: string
 *                   example: "sess_1234567890_abc123def"
 *                   description: "ID of the session that was logged out"
 *       401:
 *         description: Unauthorized
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
router.post('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const jwtToken = authHeader && authHeader.split(' ')[1];

    if (!jwtToken) {
      return res.status(401).json({
        error: 'JWT token required for logout',
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
        error: 'Invalid or expired session',
        code: 401,
        timestamp: new Date().toISOString(),
      });
    }

    // Call Houra logout with the complete session data
    const logoutSuccess = await houraService.logout(session);

    if (logoutSuccess) {
      // Remove session from storage
      sessionService.deleteSession(payload.rahouToken);

      res.json({
        success: true,
        message: 'Logged out successfully',
        sessionId: session.id,
      });
    } else {
      res.status(500).json({
        error: 'Logout failed',
        code: 500,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 500,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
