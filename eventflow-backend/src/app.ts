import express from 'express';
import http from 'http';
import { initDB } from './models/user-model';
import userRoutes from './routes/user.routes';
import { ErrorMiddleware } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import { connectRedis } from './config/redis';
import { createRateLimiter } from './middlewares/rateLimiter';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { initSocket } from './config/socket';
import { errorHandler } from "./middlewares/errorHandler";

const PORT = 5001;

const app = express();
const server = http.createServer(app);

async function startServer() {
  await connectRedis();
  initSocket(server);

  app.use(express.json());

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use('/users', userRoutes);

  app.use('/api/auth', authRoutes);

  // rate limiter BEFORE routes
  app.use('/events', createRateLimiter());
  app.use('/events', eventRoutes);

  app.use(ErrorMiddleware);
  app.use(errorHandler);

  await initDB();

  app.listen(PORT, '0.0.0.0', () => {
    console.log('Server running on port 5001');
  });
}

startServer();
