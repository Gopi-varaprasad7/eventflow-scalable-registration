import { kafka } from '../config/kafka';
import { TOPICS } from '../events/topics';
import { sendEvent } from './producer';
import { EventRegistrationEvent } from '../events/eventTypes';

const consumer = kafka.consumer({ groupId: 'eventflow-group' });

export const startConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: TOPICS.EVENT_REGISTRATION,
  });

  await consumer.subscribe({
    topic: TOPICS.EVENT_REGISTRATION_RETRY,
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data: EventRegistrationEvent = JSON.parse(
        message.value!.toString(),
      );

      try {
        console.log('Processing registration:', data);

        // simulate processing
        if (Math.random() < 0.3) {
          throw new Error('Random failure');
        }

        console.log('Processing success');
      } catch (error) {
        const retryCount = data.retryCount || 0;

        if (retryCount < 3) {
          console.log('Retrying event...');

          await sendEvent(TOPICS.EVENT_REGISTRATION_RETRY, {
            ...data,
            retryCount: retryCount + 1,
          });
        } else {
          console.log('Sending to DLQ');

          await sendEvent(TOPICS.EVENT_REGISTRATION_DLQ, data);
        }
      }
    },
  });
};
