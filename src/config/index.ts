import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment Configuration
 *
 * Centralized configuration for all environment variables
 */
interface Config {
  port: number;
  nodeEnv: string;
  apiBaseUrl: string;
  houra: {
    baseUrl?: string;
    loginUrl?: string;
    logoutUrl?: string;
    authUrl?: string;
    refererUrl?: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  session: {
    timeout: number;
  };
}

const config: Config = {
  // Server Configuration
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000',

  // Rahou Integration URLs
  houra: {
    baseUrl: process.env.HOURA_BASE_URL,
    loginUrl: process.env.HOURA_LOGIN_URL,
    logoutUrl: process.env.HOURA_LOGOUT_URL,
    authUrl: process.env.HOURA_AUTH_URL,
    refererUrl: process.env.HOURA_REFERER_URL,
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_here',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },

  // Session Configuration
  session: {
    timeout: parseInt(process.env.SESSION_TIMEOUT || '86400000', 10), // 24 hours in ms
  },
};

export default config;
