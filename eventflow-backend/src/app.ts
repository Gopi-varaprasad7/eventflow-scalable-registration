import express from 'express';
import http from 'http';
import cors from 'cors';
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
import { errorHandler } from './middlewares/errorHandler';
import { connectProducer } from './kafka/producer';
import { startConsumer } from './kafka/consumer';
import { createTopics } from './kafka/admin';

const PORT = 5001;

const app = express();
const server = http.createServer(app);

async function startServer() {
  await connectRedis();
  await initDB();

  await createTopics();
  await connectProducer();
  await startConsumer();

  initSocket(server);

  app.use(express.json());
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
  );

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use('/users', userRoutes);
  app.use('/api/auth', authRoutes);

  app.use('/events', createRateLimiter());
  app.use('/events', eventRoutes);

  app.use(ErrorMiddleware);
  app.use(errorHandler);

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
