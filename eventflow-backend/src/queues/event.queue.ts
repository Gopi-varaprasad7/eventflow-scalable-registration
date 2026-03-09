import { Queue } from "bullmq";

export const eventQueue = new Queue("event-notifications",{
    connection:{
        host:process.env.REDIS_HOST || "localhost",
        port:Number(process.env.REDIS_PORT) || 6379
    }
})