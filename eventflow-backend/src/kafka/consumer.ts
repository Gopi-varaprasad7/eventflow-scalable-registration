import { kafka } from '../config/kafka';

const consumer = kafka.consumer({
  groupId: 'eventflow-group',
});

export const startConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: 'event-registration',
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse(message.value!.toString());

      console.log('Received Event:', data);
    },
  });
};
