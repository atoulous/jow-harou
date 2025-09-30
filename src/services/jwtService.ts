import jwt from 'jsonwebtoken';

import config from '../config';

export interface JwtPayload {
  rahouToken: string;
  perimetre: string;
  iat?: number;
  exp?: number;
}

class JwtService {
  private readonly secret = config.jwt.secret;
  private readonly expiresIn = config.jwt.expiresIn;

  /**
   * Generate JWT token with Rahou token inside
   * @param rahouToken Original Rahou token
   * @param perimetre User perimeter
   * @returns JWT token
   */
  generateToken(rahouToken: string, perimetre: string): string {
    const payload: JwtPayload = {
      rahouToken,
      perimetre,
    };

    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn as any });
  }

  /**
   * Verify and decode JWT token
   * @param token JWT token
   * @returns Decoded payload or null if invalid
   */
  verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret) as JwtPayload;
      return decoded;
    } catch (error) {
      console.error('JWT verification error:', error);
      return null;
    }
  }
}

export default new JwtService();
