import { kafka } from '../config/kafka';
import { v4 as uuid } from 'uuid';

const producer = kafka.producer({
  allowAutoTopicCreation: true,
});

export const connectProducer = async () => {
  await producer.connect();
  console.log('Kafka Producer Connected');
};

export const sendEvent = async (topic: string, message: any) => {
  const eventId = uuid();

  const enrichedMessage = {
    ...message,
    eventId,
    createdAt: new Date().toISOString(),
  };

  await producer.send({
    topic,
    messages: [
      {
        key: message.eventId || eventId,
        value: JSON.stringify(enrichedMessage),
      },
    ],
  });

  console.log(`Event sent: ${eventId}`);
};
