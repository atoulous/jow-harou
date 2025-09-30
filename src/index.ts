import cors from 'cors';
import express from 'express';
import http from 'http';

import authRoutes from './routes/auth';
import healthRoutes from './routes/health';
import indexRoutes from './routes/index';
import { setupSwagger } from './swagger';

const startApp = async () => {
  try {
    const app = express();
    const port = process.env.PORT || 3000;

    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Setup Swagger documentation
    setupSwagger(app, '/swagger');

    // Routes
    app.use('/health', healthRoutes);
    app.use('/auth', authRoutes);
    app.use('/', indexRoutes);

    const server = http.createServer(app);
    server.listen(port, () => {
      console.info(`[startApp] 🚀 Server ready on http://localhost:${port}`);
      console.info(`[startApp] 📚 API Documentation available at http://localhost:${port}/swagger`);
    });
  } catch (err) {
    console.error('[startApp] err', err);
  }
};

startApp();
