/**
 * Session Service - In-memory session management
 *
 * This service handles session storage and retrieval for authenticated users.
 * In production, consider using Redis or a database for session persistence.
 */
import config from '../config';
import { RahouSession } from './rahouService';

interface StoredSession extends RahouSession {
  id: string;
  createdAt: Date;
  lastAccessedAt: Date;
  token: string;
  expiresAt: Date;
}

class SessionService {
  private sessions: Map<string, StoredSession> = new Map();
  private readonly SESSION_TIMEOUT = config.session.timeout;

  /**
   * Create a new session
   * @param token Authentication token
   * @param userData User information from login response
   * @returns Session ID
   */
  createSession(token: string, userData: any): string {
    const sessionId = this.generateSessionId();
    const now = new Date();

    const session: StoredSession = {
      id: sessionId,
      token,
      expiresAt: new Date(now.getTime() + this.SESSION_TIMEOUT),
      perimetre: userData.perimetre || '10034',
      createdAt: now,
      lastAccessedAt: now,
    };

    this.sessions.set(sessionId, session);

    return sessionId;
  }

  /**
   * Get session by token
   * @param token Authentication token
   * @returns Session or null if not found/expired
   */
  getSessionByToken(token: string): StoredSession | null {
    for (const session of this.sessions.values()) {
      if (session.token === token) {
        // Check if session is expired
        if (session.expiresAt < new Date()) {
          this.sessions.delete(session.id);
          return null;
        }

        // Update last accessed time
        session.lastAccessedAt = new Date();
        return session;
      }
    }
    return null;
  }

  /**
   * Delete session
   * @param token Authentication token
   * @returns True if session was deleted
   */
  deleteSession(token: string): boolean {
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.token === token) {
        this.sessions.delete(sessionId);
        console.log(`Session deleted: ${sessionId}`);
        return true;
      }
    }
    return false;
  }

  /**
   * Clean up expired sessions
   */
  cleanupExpiredSessions(): void {
    const now = new Date();
    let cleanedCount = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        this.sessions.delete(sessionId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired sessions`);
    }
  }

  /**
   * Generate a unique session ID
   * @returns Unique session ID
   */
  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Create singleton instance
const sessionService = new SessionService();

// Clean up expired sessions every hour
setInterval(
  () => {
    sessionService.cleanupExpiredSessions();
  },
  60 * 60 * 1000
);

export default sessionService;
