import { kafka } from '../config/kafka';
import { TOPICS } from '../events/topics';
import { sendEvent } from './producer';
import { EventRegistrationEvent } from '../events/eventTypes';
import { processWithIdempotency } from '../utils/idempotency';

const consumer = kafka.consumer({
  groupId: 'eventflow-group',
  allowAutoTopicCreation: true,
});

export const startConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({ topic: TOPICS.EVENT_REGISTRATION });
  await consumer.subscribe({ topic: TOPICS.EVENT_REGISTRATION_RETRY });

  await consumer.run({
    autoCommit: false,

    eachBatch: async ({
      batch,
      resolveOffset,
      commitOffsetsIfNecessary,
      heartbeat,
      isRunning,
      isStale,
    }) => {
      for (const message of batch.messages) {
        if (!isRunning() || isStale()) break;

        const data: EventRegistrationEvent = JSON.parse(
          message.value!.toString(),
        );

        try {
          await processWithIdempotency(data.eventId, async () => {
            console.log('Processing registration:', data);

            if (Math.random() < 0.3) {
              throw new Error('Random failure');
            }

            console.log('Processing success');
          });

          // ✅ mark success
          resolveOffset(message.offset);
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
          continue;
        }

        await heartbeat();
      }

      await commitOffsetsIfNecessary();
    },
  });
};
