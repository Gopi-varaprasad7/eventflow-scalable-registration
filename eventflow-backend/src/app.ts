import express from 'express';
import { initDB } from './models/user-model';
import userRoutes from './routes/user.routes';
import { ErrorMiddleware } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import { connectRedis } from './config/redis';
const PORT = 5001;

const app = express();
connectRedis();

app.use(express.json());
app.use('/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/events', eventRoutes);
app.use(ErrorMiddleware);

initDB();

app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on port 5001');
});
