import { Worker } from 'bullmq';

const worker = new Worker(
  'event-notifications',
  async (job) => {
    console.log('Processing job:', job.name);
    if (job.name === 'send-confirmation') {
      const { email, eventTitle } = job.data;

      console.log(`Sending confirmation email to ${email} for ${eventTitle}`);
    }

    if (job.name === 'send-reminder') {
      const { email, eventTitle } = job.data;

      console.log(`Sending reminder email to ${email} for ${eventTitle}`);
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    },
  },
);
worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});
