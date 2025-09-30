import { Router } from 'express';

import jwtService from '../../services/jwtService';
import houraService from '../../services/rahouService';
import sessionService from '../../services/sessionService';

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with Rahou credentials
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "aymeric.toulouse@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   description: "JWT token containing Rahou token"
 *                 sessionId:
 *                   type: string
 *                   example: "sess_1234567890_abc123def"
 *                   description: "Session ID for tracking user session"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "user123"
 *                     email:
 *                       type: string
 *                       example: "aymeric.toulouse@gmail.com"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-01T12:00:00.000Z"
 *                   description: "Session expiration time"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Bad request
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
        code: 400,
        timestamp: new Date().toISOString(),
      });
    }

    const loginResult = await houraService.login({ email, password });

    if (loginResult.success && loginResult.token) {
      // Generate JWT token with Rahou token inside
      const jwtToken = jwtService.generateToken(loginResult.token, loginResult.perimetre);

      // Store the complete session data
      const sessionId = sessionService.createSession(loginResult.token, {
        // id: (loginResult.user.id || loginResult.token,
        perimetre: loginResult.perimetre || '10034',
        ...loginResult.user,
      });

      // Remove sensitive data from user object before sending to frontend
      const { token: _, ...userWithoutToken } = loginResult.user as any;

      res.json({
        success: true,
        token: jwtToken, // Return JWT token instead of Rahou token
        sessionId: sessionId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        user: userWithoutToken,
      });
    } else {
      res.status(401).json({
        error: loginResult.error || 'Invalid credentials',
        code: 401,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 500,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
