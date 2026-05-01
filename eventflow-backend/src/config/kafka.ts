import { Kafka } from 'kafkajs';

const isProduction = process.env.NODE_ENV === 'production';

export const kafka = new Kafka({
  clientId: 'eventflow-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
  // Add SSL and SASL for Upstash in production
  ssl: isProduction,
  sasl: isProduction
    ? {
        mechanism: 'scram-sha-256',
        username: process.env.KAFKA_USERNAME!,
        password: process.env.KAFKA_PASSWORD!,
      }
    : undefined,
});
