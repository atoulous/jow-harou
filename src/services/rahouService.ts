/**
 * Rahou Service - Merchant Abstraction Layer
 *
 * This service handles all interactions with the Rahou e-commerce platform
 * to provide a unified API for merchant operations.
 */

import config from '../config';
import { User } from '../types/user';

export interface RahouCredentials {
  email: string;
  password: string;
}

export interface RahouLoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
  error?: string;
  perimetre?: string;
}

export interface RahouSession {
  token: string;
  expiresAt: Date;
  perimetre: string;
}

class RahouService {
  /**
   * Authenticate user with Rahou credentials
   * @param credentials User email and password
   * @returns Login response with token and user info
   */
  async login(credentials: RahouCredentials): Promise<RahouLoginResponse> {
    try {
      console.log('Attempting to login to Rahou with:', credentials.email);

      const res = await fetch(config.houra.loginUrl, {
        headers: {
          accept: 'application/json, text/plain, */*',
          authorization: 'Bearer',
          'content-type': 'application/x-www-form-urlencoded',
          cookie: 'SHOW_CART=false',
          Referer: config.houra.refererUrl,
        },
        body: new URLSearchParams({
          email: credentials.email,
          password: credentials.password,
        }).toString(),
        method: 'POST',
      });

      const data = await res.json();

      if (!data?.success === false) {
        return {
          success: false,
          error: data?.message || 'Invalid login response',
        };
      }

      return {
        success: true,
        user: data,
        token: data.token,
      };
    } catch (error) {
      console.error('Rahou login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Logout user from Rahou
   * @param session Current user session
   * @returns Success status
   */
  async logout(session: RahouSession): Promise<boolean> {
    try {
      console.log('Logging out from Rahou for session==', session);

      const res = await fetch(config.houra.logoutUrl, {
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-language': 'en,fr;q=0.9',
          authorization: `Bearer ${session.token}`,
          'content-type': 'application/json',
          cookie: `ID_PERIMETRE=${session.perimetre}; ID=${session.token}; AUTH_CREDENTIAL=${encodeURIComponent(
            JSON.stringify({ token: session.token })
          )}`,
          Referer: config.houra.refererUrl,
        },
        body: '{}',
        method: 'POST',
      });

      const data = await res.json();

      if (data.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Rahou logout error:', error);
      return false;
    }
  }

  /**
   * Get current user information
   * @param token Authentication token
   * @returns User info if valid, null if invalid
   */
  async getMe(session: RahouSession): Promise<any | null> {
    try {
      console.log('Getting user info from Rahou:', session);

      const res = await fetch(`${config.houra.baseUrl}/ws2/next-react/me.php`, {
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-language': 'en,fr;q=0.9',
          authorization: `Bearer ${session.token}`,
          Referer: `${config.houra.refererUrl}/mon-compte/informations-personnelles`,
        },
        method: 'GET',
      });

      const data = await res.json();

      console.log('Rahou getMe data:', data);

      return data;
    } catch (error) {
      console.error('Get user info error:', error);
      return null;
    }
  }
}

export default new RahouService();
