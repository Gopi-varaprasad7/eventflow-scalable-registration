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

const PORT = Number(process.env.PORT) || 5001;

const app = express();
const server = http.createServer(app);

async function startServer() {
  async function startServer() {
    // ✅ Redis (only if configured)
    try {
      await connectRedis();
      console.log('Redis initialized');
    } catch {
      console.log('Redis skipped');
    }

    // ✅ Database (must work)
    try {
      await initDB();
      console.log('Database connected');
    } catch (err) {
      console.error('Database connection failed');
      process.exit(1);
    }

    // ✅ Kafka (ONLY if enabled)
    if (process.env.KAFKA_ENABLED === 'true') {
      try {
        await createTopics();
        await connectProducer();
        await startConsumer();
        console.log('Kafka connected');
      } catch {
        console.log('Kafka failed, skipping');
      }
    } else {
      console.log('Kafka disabled');
    }

    // ✅ Socket
    initSocket(server);

    // ✅ Middlewares
    app.use(express.json());

    app.use(
      cors({
        origin: true,
        credentials: true,
      }),
    );

    // ✅ Health check
    app.get('/', (req, res) => {
      res.send('EventFlow API running 🚀');
    });

    // ✅ Swagger
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // ✅ Routes
    app.use('/users', userRoutes);
    app.use('/api/auth', authRoutes);

    // ❌ Disabled for now (Redis-based)
    // app.use('/events', createRateLimiter());

    app.use('/events', eventRoutes);

    // ✅ Errors
    app.use(ErrorMiddleware);
    app.use(errorHandler);

    // ✅ Start server
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

startServer();
