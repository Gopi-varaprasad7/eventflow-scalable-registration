import { kafka } from '../config/kafka';

const producer = kafka.producer();

export const connectProducer = async<T> () => {
  await producer.connect();
  console.log('Kafka Producer Connected');
};

export const sendEvent = async (topic: string, message: object) => {
  await producer.send({
    topic,
    messages: [
      {
        value: JSON.stringify(message),
      },
    ],
  });
};
