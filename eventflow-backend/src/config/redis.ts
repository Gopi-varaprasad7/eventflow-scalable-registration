import { createClient } from 'redis';

let redisClient: any = null;

export async function connectRedis() {
  // ❌ If no Redis config → skip completely
  if (!process.env.REDIS_HOST) {
    console.log('Redis disabled (no REDIS_HOST)');
    return;
  }

  redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT) || 6379,
    },
  });

  redisClient.on('error', (err: any) => {
    console.log('Redis error:', err.message);
  });

  try {
    await redisClient.connect();
    console.log('Connected to Redis 🚀');
  } catch (err) {
    console.log('Redis connection failed, skipping...');
  }
}

export { redisClient };
