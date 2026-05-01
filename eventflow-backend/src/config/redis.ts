import { createClient } from 'redis';

let redisClient: any = null;

export async function connectRedis() {
  // Railway provides REDIS_URL, Docker uses REDIS_HOST
  const redisUrl = process.env.REDIS_URL;
  const redisHost = process.env.REDIS_HOST;

  if (!redisUrl && !redisHost) {
    console.log('Redis disabled');
    return;
  }

  // Railway (production) uses REDIS_URL
  if (redisUrl) {
    redisClient = createClient({
      url: redisUrl,
    });
  }
  // Docker (local) uses REDIS_HOST
  else {
    redisClient = createClient({
      socket: {
        host: redisHost,
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    });
  }

  redisClient.on('error', (err: any) => {
    console.error('Redis error:', err);
  });

  try {
    await redisClient.connect();
    console.log('Redis connected ✅');
  } catch (err) {
    console.log('Redis connection failed:', err);
  }
}

export { redisClient };
