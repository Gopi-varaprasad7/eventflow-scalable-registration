import Queue from "bull";

export const emailQueue = new Queue("email-queue", {
  redis: {
    host: process.env.REDIS_HOST || "redis",
    port: 6379,
  },
});