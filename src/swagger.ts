import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import config from './config';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Jow RA Hou',
      version: '1.0.0',
      description: 'API wrapper for e-commerce platform integration',
    },
    servers: [
      {
        url: config.apiBaseUrl,
        description: config.nodeEnv === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token containing Rahou token',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'integer' },
            timestamp: { type: 'string', format: 'date-time' },
          },
          required: ['error', 'timestamp'],
        },
      },
    },
    tags: [
      { name: 'Authentication', description: 'User authentication' },
      { name: 'Health', description: 'Health check' },
    ],
  },
  apis: ['./src/routes/*.ts', './src/routes/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Express, basePath: string = '/swagger') => {
  const swaggerUiOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  app.use(basePath, swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

  app.get(`${basePath}/swagger.json`, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

export default { swaggerSpec, setupSwagger };
