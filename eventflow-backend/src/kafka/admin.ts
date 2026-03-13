import { kafka } from "../config/kafka"
import { TOPICS } from "../events/topics"

const admin = kafka.admin()

export const createTopics = async () => {
  await admin.connect()
  await admin.createTopics({
    topics: [
      {
        topic: TOPICS.EVENT_REGISTRATION,
        numPartitions: 3,
        replicationFactor: 1
      },
      {
        topic: TOPICS.EVENT_REGISTRATION_RETRY,
        numPartitions: 3,
        replicationFactor: 1
      },
      {
        topic: TOPICS.EVENT_REGISTRATION_DLQ,
        numPartitions: 1,
        replicationFactor: 1
      }
    ]
  })

  console.log("Kafka topics created")

  await admin.disconnect()
}