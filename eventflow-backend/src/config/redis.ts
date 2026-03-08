import { createClient } from "redis";

export const redisClient = createClient({
    socket:{
        host:process.env.REDIS_HOST || "localhost",
        port:Number(process.env.REDIS_PORT) || 6379
    }
})

redisClient.on("error", (err) => {
  console.error("Redis error", err);
});

export const connectRedis = async () => {
    if(!redisClient.isOpen){
        await redisClient.connect();
        console.log("Connected to Redis 🚀")
    }
}