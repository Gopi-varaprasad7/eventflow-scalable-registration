import { createClient } from 'redis';

let redisClient: any = null;

export async function connectRedis() {
  if (!process.env.REDIS_HOST) {
    console.log('Redis disabled');
    return;
  }

  redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT) || 6379,
    },
  });

  redisClient.on('error', () => {}); // 🔇 silence spam

  try {
    await redisClient.connect();
    console.log('Redis connected');
  } catch {
    console.log('Redis skipped');
  }
}

export { redisClient };
